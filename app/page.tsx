import Products from "@/app/components/products/products"
import { db } from "@/server"
import ProductTags from "@/app/components/products/product-tags"
import HeroSection from "@/app/components/hero-section"
import FeaturedJerseys from "@/app/components/feautured-jerseys"
import BrandStatement from "@/app/components/Brand-Statement"
import BestSellers from "@/app/components/Best-Sellers"
import { eq, or } from "drizzle-orm"
import { products } from "@/server/schema"

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  })

  const featured = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
    limit: 6,
  })

  const pitchProducts = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    where: (productVariants, { inArray }) =>
      inArray(productVariants.productID,
        db.select({ id: products.id })
          .from(products)
          .where(or(
            eq(products.category, "football"),
            eq(products.category, "basketball")
          ))
      ),
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
    limit: 6,
  })

  return (
    <main className="w-full">
      <HeroSection />
      <FeaturedJerseys variants={featured} />
      <BrandStatement />
      <BestSellers variants={pitchProducts} />
      <ProductTags />
      <Products variants={data} />
    </main>
  )
}