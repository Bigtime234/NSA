'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/client-store'
import { toast } from 'sonner'
import formatPrice from '@/lib/format-price'
import { VariantsWithProduct } from '@/lib/infer-types'

type FeaturedJerseysProps = {
  variants: VariantsWithProduct[]
}

const TAGS = ['Bestseller', 'New', 'Limited']

export default function FeaturedJerseys({ variants }: FeaturedJerseysProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const { addToCart } = useCartStore()
  const [quantities] = useState<Record<number, number>>({})

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap?.registerPlugin(ScrollTrigger)

      gsap?.set(headingRef?.current, { y: 40, opacity: 0 })
      gsap?.set(
        cardsRef?.current?.children
          ? Array.from(cardsRef?.current?.children)
          : [],
        { y: 60, opacity: 0 }
      )

      gsap?.to(headingRef?.current, {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef?.current,
          start: 'top 80%',
        },
      })

      if (cardsRef?.current) {
        gsap?.to(Array.from(cardsRef?.current?.children), {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef?.current,
            start: 'top 85%',
          },
        })
      }
    }
    init()
  }, [])

  // Only ever called for equipment now — apparel navigates via a real Link (see JSX)
  const handleAddToCart = (variant: VariantsWithProduct) => {
    const image = variant.variantImages?.[0]?.url || '/placeholder.jpg'

    toast.success(`Added ${variant.product.title} ${variant.productType} to your cart!`)
    addToCart({
      id: variant.product.id,
      variant: { variantID: variant.id, quantity: 1 },
      name: `${variant.product.title} ${variant.productType}`,
      price: variant.product.price,
      image,
    })
  }

  return (
    <section ref={sectionRef} id="jerseys" className="py-28 md:py-36 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <div
          ref={headingRef}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-6"
          style={{ opacity: 1 }}
        >
          <div>
            <p className="text-gray-400 font-semibold uppercase mb-4 tracking-[0.45em] text-xs">
              Featured Drop
            </p>
            <h2 className="text-5xl md:text-7xl font-black uppercase text-black leading-none">
              The<br />
              <span className="text-gray-400">Jerseys.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-gray-500 max-w-xs leading-relaxed text-sm">
              Engineered for performance. Designed for the streets. Each jersey
              built with moisture-wicking precision fabric.
            </p>
            <Link
              href="/products"
              className="border border-black text-black font-bold uppercase py-3 px-6 text-[0.65rem] tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-300"
            >
              View All Jerseys
            </Link>
          </div>
        </div>

        {/* Product grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {variants?.map((variant, index) => {
            const image = variant.variantImages?.[0]?.url || '/placeholder.jpg'
            const hoverImage = variant.variantImages?.[1]?.url || image
            const tag = TAGS[index % TAGS.length]

            return (
              <div
                key={variant.id}
                className="group cursor-pointer"
                style={{ opacity: 1 }}
              >
                {/* Image container */}
                <div className="relative aspect-[3/4] mb-6 bg-gray-100 overflow-hidden">

                  {/* Primary image */}
                  <Image
                    src={image}
                    alt={variant.product.title}
                    fill
                    className="object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  {/* Hover image */}
                  <Image
                    src={hoverImage}
                    alt={variant.product.title}
                    fill
                    className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  {/* Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="text-white bg-black px-3 py-1 font-bold uppercase"
                      style={{ fontSize: '0.55rem', letterSpacing: '0.3em' }}
                    >
                      {tag}
                    </span>
                  </div>

                  {/* Add to Cart / Select Size overlay on hover */}
                  {variant.product.itemType === 'apparel' ? (
                    <Link
                      href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${image}&itemType=${variant.product.itemType}`}
                      className="absolute inset-x-0 bottom-0 z-10 bg-black py-4 text-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 w-full"
                    >
                      <span
                        className="text-white font-bold uppercase"
                        style={{ fontSize: '0.65rem', letterSpacing: '0.35em' }}
                      >
                        Select Size
                      </span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(variant)}
                      className="absolute inset-x-0 bottom-0 z-10 bg-black py-4 text-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 w-full"
                    >
                      <span
                        className="text-white font-bold uppercase"
                        style={{ fontSize: '0.65rem', letterSpacing: '0.35em' }}
                      >
                        Add to Cart
                      </span>
                    </button>
                  )}
                </div>

                {/* Product info */}
                <Link
                  href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${image}&itemType=${variant.product.itemType}`}
                  className="flex items-start justify-between"
                >
                  <div>
                    <h3 className="text-black font-bold text-lg mb-1 uppercase tracking-tight">
                      {variant.product.title}
                    </h3>
                    <p
                      className="text-gray-400 uppercase"
                      style={{ fontSize: '0.6rem', letterSpacing: '0.4em', fontWeight: 600 }}
                    >
                      {variant.productType}
                    </p>
                  </div>
                  <span className="text-black font-bold text-lg">
                    {formatPrice(variant.product.price)}
                  </span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}