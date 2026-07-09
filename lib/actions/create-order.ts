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
              size: item.size,
              playerName: item.playerName,
              playerNumber: item.playerNumber,
            })
          })
        )
      }

      const itemsSubtotal = total - dispatchFee
      const locationLabel = getDispatchLabel(dispatchLocation)

      const productsHtml = products?.map(product => `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #ececec;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #000;">
                  ${product.name}
                </td>
                <td align="right" style="font-size: 14px; font-weight: 700; color: #000; white-space: nowrap;">
                  ₦${product.price.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td colspan="2" style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; padding-top: 4px;">
                  Qty: ${product.quantity}
                  ${product.size ? ` &nbsp;·&nbsp; Size: ${product.size}` : ''}
                  ${(product.playerName || product.playerNumber) ? ` &nbsp;·&nbsp; ${product.playerName ?? ''} ${product.playerNumber ?? ''}` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `).join('') || ''

      const { error } = await resend.emails.send({
        from: "NSA <onboarding@resend.dev>",
        to: "nsaofficial001@gmail.com",
        subject: `Order Confirmation #${order.id}`,
        html: `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Helvetica, Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 32px 16px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px; width: 100%;">

                  <!-- Header banner -->
                  <tr>
                    <td style="background-color: #000000; padding: 32px 40px; text-align: center;">
                      <span style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 6px; text-transform: uppercase;">NSA</span>
                    </td>
                  </tr>

                  <!-- Order confirmation strip -->
                  <tr>
                    <td style="padding: 24px 40px 8px 40px;">
                      <p style="margin: 0; font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #999;">New Order Received</p>
                      <p style="margin: 6px 0 0 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #000; text-transform: uppercase;">Order #${order.id}</p>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr><td style="padding: 16px 40px 0 40px;"><div style="height: 1px; background-color: #000;"></div></td></tr>

                  <!-- Products -->
                  <tr>
                    <td style="padding: 24px 40px 0 40px;">
                      <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #999;">Items</p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        ${productsHtml}
                      </table>
                    </td>
                  </tr>

                  <!-- Order summary -->
                  <tr>
                    <td style="padding: 20px 40px 0 40px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="font-size: 12px; color: #666; padding: 4px 0;">Subtotal</td>
                          <td align="right" style="font-size: 12px; font-weight: 600; color: #000; padding: 4px 0;">₦${itemsSubtotal.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 12px; color: #666; padding: 4px 0;">Dispatch Fee (${locationLabel})</td>
                          <td align="right" style="font-size: 12px; font-weight: 600; color: #000; padding: 4px 0;">₦${dispatchFee.toLocaleString()}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Total (black block) -->
                  <tr>
                    <td style="padding: 16px 40px 0 40px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000; padding: 14px 20px;">
                        <tr>
                          <td style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #fff; padding: 10px 16px;">Total</td>
                          <td align="right" style="font-size: 18px; font-weight: 900; color: #fff; padding: 10px 16px;">₦${total.toLocaleString()}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr><td style="padding: 28px 40px 0 40px;"><div style="height: 1px; background-color: #ececec;"></div></td></tr>

                  <!-- Customer details -->
                  <tr>
                    <td style="padding: 24px 40px 0 40px;">
                      <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #999;">Customer</p>
                      <p style="margin: 0; font-size: 13px; color: #333; line-height: 1.8;">
                        <strong style="color: #000;">${customerInfo.fullName}</strong><br />
                        ${customerInfo.email}<br />
                        ${customerInfo.phone}
                      </p>
                    </td>
                  </tr>

                  <!-- Delivery details -->
                  <tr>
                    <td style="padding: 20px 40px 0 40px;">
                      <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #999;">Delivery</p>
                      <p style="margin: 0; font-size: 13px; color: #333; line-height: 1.8;">
                        ${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.postalCode}<br />
                        <strong style="color: #000;">Location:</strong> ${locationLabel}<br />
                        <strong style="color: #000;">Payment:</strong> ${paymentMethod}
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 32px 40px 32px 40px;">
                      <div style="height: 1px; background-color: #ececec; margin-bottom: 20px;"></div>
                      <p style="margin: 0; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #bbb; text-align: center;">
                        NSA — Premium Sports Jerseys & Apparel
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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