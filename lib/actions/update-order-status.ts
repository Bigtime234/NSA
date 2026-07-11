"use server"

import { db } from "@/server"
import { auth } from "@/server/auth"
import { orders } from "@/server/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"

export async function updateOrderStatus(
  orderId: string,
  newStatus: "pending" | "processing" | "succeeded" | "completed" | "cancelled"
) {
  const user = await auth()
  if (!user) throw new Error("Unauthorized")

  const isAdmin = user.user.role === "admin"
  if (!isAdmin) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, Number(orderId)),
    })
    if (!order || order.userID !== user.user.id) {
      throw new Error("Unauthorized to update this order")
    }
  }

  try {
    await db
      .update(orders)
      .set({ status: newStatus })
      .where(eq(orders.id, Number(orderId)))

    if (newStatus === "succeeded") {
      const order = await db.query.orders.findFirst({
        where: eq(orders.id, Number(orderId)),
        with: {
          orderProduct: { with: { product: true } },
        },
      })

      if (order?.customerEmail) {
        const resend = new Resend(process.env.RESEND_API_KEY)

        const itemsHtml = order.orderProduct
          .map(
            (item) => `
          <tr>
            <td style="padding: 14px 0; border-bottom: 1px solid #ececec;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #000;">
                    ${item.product.title}
                  </td>
                  <td align="right" style="font-size: 14px; font-weight: 700; color: #000; white-space: nowrap;">
                    ₦${item.product.price.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; padding-top: 4px;">
                    Qty: ${item.quantity}
                    ${item.size ? ` &nbsp;·&nbsp; Size: ${item.size}` : ""}
                    ${
                      item.playerName || item.playerNumber
                        ? ` &nbsp;·&nbsp; ${item.playerName ?? ""} ${item.playerNumber ?? ""}`
                        : ""
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `
          )
          .join("")

        const emailResult = await resend.emails.send({
          from: "NSA <onboarding@resend.dev>",
          to: order.customerEmail,
          subject: `You're All Set — Order #${order.id} Confirmed`,
          html: `
          <!DOCTYPE html>
          <html>
          <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Helvetica, Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 32px 16px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px; width: 100%;">
                    <tr>
                      <td style="background-color: #000000; padding: 36px 40px; text-align: center;">
                        <span style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 8px; text-transform: uppercase;">NSA</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 40px 8px 40px;">
                        <p style="margin: 0; font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #999;">Payment Received</p>
                        <p style="margin: 10px 0 0 0; font-size: 30px; font-weight: 900; letter-spacing: -0.8px; line-height: 1.1; color: #000; text-transform: uppercase;">It's Confirmed.</p>
                        <p style="margin: 16px 0 0 0; font-size: 14px; color: #444; line-height: 1.7;">
                          ${order.customerName ? `${order.customerName.split(" ")[0]}, y` : "Y"}our order is locked in. We've received your payment and your gear is now being prepared for dispatch — built for performance, made to move.
                        </p>
                      </td>
                    </tr>
                    <tr><td style="padding: 24px 40px 0 40px;"><div style="height: 1px; background-color: #000;"></div></td></tr>
                    <tr>
                      <td style="padding: 28px 40px 0 40px;">
                        <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #999;">Order #${order.id}</p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          ${itemsHtml}
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 40px 0 40px;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000; padding: 14px 20px;">
                          <tr>
                            <td style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #fff; padding: 10px 16px;">Total Paid</td>
                            <td align="right" style="font-size: 18px; font-weight: 900; color: #fff; padding: 10px 16px;">₦${order.total.toLocaleString()}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 32px 40px 0 40px;">
                        <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #999;">Dispatch To</p>
                        <p style="margin: 0; font-size: 13px; color: #333; line-height: 1.8;">
                          ${order.shippingAddress ?? ""}, ${order.shippingCity ?? ""}, ${order.shippingState ?? ""} ${order.shippingPostalCode ?? ""}<br />
                          <strong style="color: #000;">Route:</strong> ${order.dispatchLocation ? order.dispatchLocation : "N/A"}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 28px 40px 0 40px;">
                        <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.7;">
                          Our dispatch rider will call you directly to arrange delivery once your order is on the way. Keep your phone close.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 32px 40px 32px 40px;">
                        <div style="height: 1px; background-color: #ececec; margin-bottom: 24px;"></div>
                        <p style="margin: 0; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #000; text-align: center;">NSA</p>
                        <p style="margin: 6px 0 0 0; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #bbb; text-align: center;">Play At The Highest Level</p>
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

        if (emailResult.error) {
          console.error("Customer confirmation email failed:", emailResult.error)
        } else {
          console.log("Customer confirmation email sent:", emailResult.data)
        }
      } else {
        console.warn("No customerEmail found on order — skipped confirmation email")
      }
    }

    revalidatePath("/dashboard/orders")
    return { success: true }
  } catch (error) {
    console.error("Error updating order status:", error)
    throw new Error("Failed to update order status")
  }
}