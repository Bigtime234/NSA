"use server"
import { ProductSchema } from "@/types/product-schema"
import { createSafeActionClient } from "next-safe-action"
import { db } from "@/server"
import { eq } from "drizzle-orm"
import { products } from "@/server/schema"
import { revalidatePath } from "next/cache"

const actionClient = createSafeActionClient();

export const createProduct = actionClient.schema(ProductSchema).action(
  async ({ parsedInput: { description, price, title, id, category } }) => {
    try {
      // EDIT MODE
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        })
        if (!currentProduct) return { error: "Product not found" }

        const editedProduct = await db
          .update(products)
          .set({ description, price, title, category })
          .where(eq(products.id, id))
          .returning()

        revalidatePath("/dashboard/products")
        return { success: `Product ${editedProduct[0].title} has been edited` }
      }

      // CREATE MODE
      const newProduct = await db
        .insert(products)
        .values({ description, price, title, category })
        .returning()

      revalidatePath("/dashboard/products")
      return { success: `Product ${newProduct[0].title} has been created` }

    } catch (err) {
      console.error("Server action error:", err)
      return { error: "Failed to create product" }
    }
  }
)