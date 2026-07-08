"use server";

import { Resend } from "resend";
import getBaseURL from "@/lib/base-url";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendNewOrderNotificationEmail = async (order: {
  id: string | number;
  customerName: string;
  customerEmail: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
}) => {
  const orderLink = `${domain}/admin/orders/${order.id}`;

  const itemsHtml = order.items
    .map(
      (item) =>
        `<li>${item.quantity} × ${item.name} — ₦${item.price.toLocaleString()}</li>`
    )
    .join("");

  const html = `
    <h2>🛒 New Order Received</h2>
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Customer:</strong> ${order.customerName}</p>
    <p><strong>Email:</strong> ${order.customerEmail}</p>
    <p><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>
    <p><strong>Items:</strong></p>
    <ul>${itemsHtml}</ul>
    <p><a href="${orderLink}">🔗 View Order in Admin Panel</a></p>
  `;

  const { error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: "nsaofficial001@gmail.com", // Replace with your admin email
    subject: `🛒 New Order - #${order.id}`,
    html,
  });

  if (error) {
    console.error("Failed to send admin email:", error);
  }
};
