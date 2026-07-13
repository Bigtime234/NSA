"use client"
import { VariantsWithProduct } from "@/lib/infer-types"
import Link from "next/link"
import Image from "next/image"
import formatPrice from "@/lib/format-price"
import { useMemo, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useCartStore } from "@/lib/client-store"
import { toast } from "sonner"

type ProductTypes = {
  variants: VariantsWithProduct[]
  search?: string
}

// Highlight matching text
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const parts = text.split(new RegExp(`(${query})`, "gi"))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-300 text-black px-0.5 rounded-sm not-italic"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export default function Products({ variants, search }: ProductTypes) {
  const params = useSearchParams()
  const paramCategory = params.get("category")
  const paramSearch = params.get("search") || search || ""
  const gridRef = useRef<HTMLDivElement>(null)
  const { addToCart } = useCartStore()

  const handleAddToCart = (
    e: React.MouseEvent,
    variant: VariantsWithProduct
  ) => {
    e.preventDefault()
    e.stopPropagation()
    const image = variant.variantImages?.[0]?.url || "/placeholder.jpg"
    toast.success(`Added ${variant.product.title} ${variant.productType} to your cart!`)
    addToCart({
      id: variant.product.id,
      variant: { variantID: variant.id, quantity: 1 },
      name: `${variant.product.title} ${variant.productType}`,
      price: variant.product.price,
      image,
    })
  }

  const filtered = useMemo(() => {
    let result = variants

    // Filter by category
    if (paramCategory) {
      result = result.filter(
        (variant) => variant.product.category === paramCategory
      )
    }

    // Filter by search
    if (paramSearch) {
      result = result.filter(
        (variant) =>
          variant.product.title
            .toLowerCase()
            .includes(paramSearch.toLowerCase()) ||
          variant.productType
            .toLowerCase()
            .includes(paramSearch.toLowerCase())
      )
    }

    return result
  }, [paramCategory, paramSearch, variants])

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      gsap.registerPlugin(ScrollTrigger)

      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children)
        gsap.set(cards, { y: 50, opacity: 0 })
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
        })
      }
    }
    init()
  }, [filtered])

  return (
    <section className="w-full py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Search results label */}
        {paramSearch && (
          <div className="mb-8">
            <p className="text-black/50 font-semibold uppercase tracking-[0.3em] text-xs">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for{" "}
              <span className="text-black">"{paramSearch}"</span>
            </p>
          </div>
        )}

        {/* Product grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((variant) => (
            <Link
              key={variant.id}
              href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0]?.url}&itemType=${variant.product.itemType}`}
              className="group block w-full"
            >
              <div className="relative bg-white overflow-hidden h-full border border-black/10 hover:border-black transition-all duration-300">

                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <Image
                    className="object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                    src={variant.variantImages[0]?.url}
                    fill
                    alt={variant.product.title}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Category badge */}
                  {variant.product.category && variant.product.category !== "all" && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-black text-white px-3 py-1 font-bold uppercase"
                        style={{ fontSize: "0.55rem", letterSpacing: "0.3em" }}>
                        {variant.product.category}
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-white text-black px-3 py-1 font-black text-sm border border-black/10">
                      {formatPrice(variant.product.price)}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  {variant.product.itemType === "apparel" ? (
                    <div className="absolute inset-x-0 bottom-0 bg-black py-3 text-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <span className="text-white font-bold uppercase"
                        style={{ fontSize: "0.6rem", letterSpacing: "0.35em" }}>
                        Select Size
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, variant)}
                      className="absolute inset-x-0 bottom-0 bg-black py-3 text-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-20 w-full"
                    >
                      <span className="text-white font-bold uppercase"
                        style={{ fontSize: "0.6rem", letterSpacing: "0.35em" }}>
                        Add to Cart
                      </span>
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h2 className="font-black text-base uppercase tracking-tight text-black mb-1">
                    <Highlight
                      text={variant.product.title}
                      query={paramSearch}
                    />
                  </h2>
                  <p className="text-black/40 uppercase font-semibold"
                    style={{ fontSize: "0.6rem", letterSpacing: "0.35em" }}>
                    <Highlight
                      text={variant.productType}
                      query={paramSearch}
                    />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-black font-black uppercase text-2xl mb-2">
              No products found
            </p>
            <p className="text-black/40 uppercase tracking-[0.3em] text-xs">
              {paramSearch
                ? `No results for "${paramSearch}"`
                : `No products in this category yet`}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}