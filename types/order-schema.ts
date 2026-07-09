import { z } from "zod"

const orderProductSchema = z.object({
  productID: z.number(),
  variantID: z.number(),
  quantity: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string().optional(),
  size: z.string().optional(),
  playerName: z.string().optional(),
  playerNumber: z.string().optional(),
})

const customerInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  whatsapp: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
})

export const createOrderSchema = z.object({
  products: z.array(orderProductSchema).optional(),
  status: z.string(),
  total: z.number(),
  customerInfo: customerInfoSchema,
  paymentMethod: z.string(),
  dispatchLocation: z.string().min(1, "Delivery location is required"),
  dispatchFee: z.number(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type OrderProduct = z.infer<typeof orderProductSchema>