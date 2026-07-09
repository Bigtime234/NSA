import * as z from "zod"

export const SportCategories = [
  "all",
  "football",
  "basketball",
  "tennis",
  "boxing",
  "badminton",
  "handball",
] as const

export const ItemTypes = ["apparel", "equipment"] as const

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long",
  }),
  description: z.string().min(80, {
    message: "Description must be at least 80 characters long",
  }),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive({ message: "Price must be a positive number" }),
  category: z.enum(SportCategories),
  itemType: z.enum(ItemTypes),
})

export type zProductSchema = z.infer<typeof ProductSchema>