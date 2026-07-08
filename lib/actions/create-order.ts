"use server"
import { db } from "@/server"
import { auth } from "@/server/auth"
import { orders, orderProduct } from "@/server/schema"
import { Resend } from "resend"
import { createSafeActionClient } from "next-safe-action"
import { createOrderSchema } from "@/types/order-schema"
import { getDispatchLabel } from "@/lib/dispatch-fees"

const resend = new Resend(process.env.RESEND_API_KEY)
const action = createSafeActionClient()

export const createOrder = action.schema(createOrderSchema).action(
  async ({ parsedInput }) => {
    const user = await auth()
    if (!user) return { error: "Unauthorized" }

    try {
      const {
        products,
        status,
        total,
        customerInfo,
        paymentMethod,
        dispatchLocation,
        dispatchFee,
      } = parsedInput

      // 1. Create order
      const [order] = await db
        .insert(orders)
        .values({
          status,
          total,
          userID: user.user.id,
          customerName: customerInfo.fullName,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerWhatsapp: customerInfo.whatsapp,
          shippingAddress: customerInfo.address,
          shippingCity: customerInfo.city,
          shippingState: customerInfo.state,
          shippingPostalCode: customerInfo.postalCode,
          paymentMethod,
          dispatchLocation,
          dispatchFee,
          created: new Date(),
        })
        .returning()

      // 2. Insert order products
      if (products?.length) {
        await Promise.all(
          products.map(async (item) => {
            await db.insert(orderProduct).values({
              quantity: item.quantity,
              orderID: order.id,
              productID: item.productID,
              productVariantID: item.variantID,
            })
          })
        )
      }

      const itemsSubtotal = total - dispatchFee
      const locationLabel = getDispatchLabel(dispatchLocation)

      const { error } = await resend.emails.send({
        from: "NSA <onboarding@resend.dev>",
        to: "nsaofficial001@gmail.com",
        subject: `Order Confirmation #${order.id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
            <h1 style="color: #000; text-align: center; text-transform: uppercase; letter-spacing: 2px;">NSA</h1>
            <p style="font-size: 16px; text-align: center; margin-bottom: 30px;">Order #${order.id}</p>

            <div style="margin-bottom: 20px;">
              <h2 style="color: #000; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Products</h2>
              ${products?.map(product => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>${product.name} (x${product.quantity})</span>
                  <span><strong>₦${product.price.toLocaleString()}</strong></span>
                </div>
              `).join('') || ''}
            </div>

            <div style="margin-bottom: 20px;">
              <h2 style="color: #000; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Customer Details</h2>
              <p><strong>Name:</strong> ${customerInfo.fullName}</p>
              <p><strong>Email:</strong> ${customerInfo.email}</p>
              <p><strong>Phone:</strong> ${customerInfo.phone}</p>
              <p><strong>Address:</strong> ${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.postalCode}</p>
              <p><strong>Delivery Location:</strong> ${locationLabel}</p>
            </div>

            <div style="background-color: #f5f5f5; padding: 15px;">
              <h2 style="color: #000; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Summary</h2>
              <p><strong>Subtotal:</strong> ₦${itemsSubtotal.toLocaleString()}</p>
              <p><strong>Dispatch Fee (${locationLabel}):</strong> ₦${dispatchFee.toLocaleString()}</p>
              <p><strong>Total:</strong> ₦${total.toLocaleString()}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            </div>
          </div>
        `,
      })

      if (error) {
        console.error("Email failed:", error)
        return { error: "Order created but email failed" }
      }

      return { success: true, orderId: order.id }
    } catch (err) {
      console.error("Order creation failed:", err)
      return { error: "Database error occurred" }
    }
  }
)