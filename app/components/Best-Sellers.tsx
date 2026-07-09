'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import formatPrice from '@/lib/format-price';
import { VariantsWithProduct } from '@/lib/infer-types';

type BestSellersProps = {
  variants: VariantsWithProduct[]
}

export default function BestSellers({ variants }: BestSellersProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const floatingImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(headingRef.current, { y: 40, opacity: 0 });

      gsap.to(headingRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });

      if (listRef.current) {
        gsap.set(Array.from(listRef.current.children), { y: 30, opacity: 0 });
        gsap.to(Array.from(listRef.current.children), {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: listRef.current, start: 'top 85%' },
        });
      }
    };
    init();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (floatingImgRef.current) {
      const x = mousePos.x - 100;
      const y = mousePos.y - 150;
      floatingImgRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  }, [mousePos]);

  return (
    <section ref={sectionRef} className="py-28 md:py-36 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10">

        {/* Heading */}
        <div ref={headingRef} className="mb-16 md:mb-20" style={{ opacity: 1 }}>
          <p className="text-black/40 font-semibold uppercase mb-4 tracking-[0.45em] text-xs">
            Editorial Picks
          </p>
          <h2 className="text-5xl md:text-7xl font-black uppercase text-black leading-none">
            Best<br />
            <span className="text-black/20">Sellers.</span>
          </h2>
        </div>

        {/* Numbered list */}
        <div ref={listRef} className="divide-y divide-black/10" style={{ opacity: 1 }}>
          {variants?.map((variant, index) => {
            const image = variant.variantImages?.[0]?.url || '/placeholder.jpg'
            const rank = String(index + 1).padStart(2, '0')

            return (
              <Link
                key={variant.id}
                href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${image}&itemType=${variant.product.itemType}`}
                className="group py-6 md:py-8 flex items-center gap-6 md:gap-10 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Rank */}
                <span
                  className="text-black/20 font-black shrink-0"
                  style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)', letterSpacing: '0.05em' }}
                >
                  {rank}
                </span>

                {/* Thumbnail */}
                <div className="w-14 h-14 md:w-16 md:h-16 bg-black/5 overflow-hidden shrink-0 relative">
                  <Image
                    src={image}
                    alt={variant.product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="64px"
                  />
                </div>

                {/* Name + category */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-black font-black uppercase group-hover:text-black/40 transition-colors truncate"
                    style={{ fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', letterSpacing: '-0.02em' }}
                  >
                    {variant.product.title}
                  </h3>
                  <p
                    className="text-black/40 uppercase hidden sm:block"
                    style={{ fontSize: '0.6rem', letterSpacing: '0.4em', fontWeight: 600 }}
                  >
                    {variant.productType}
                  </p>
                </div>

                {/* Category sport tag */}
                <span
                  className="text-black/30 font-semibold hidden md:block shrink-0 uppercase"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.3em' }}
                >
                  {variant.product.category}
                </span>

                {/* Price + arrow */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-black font-black text-lg">
                    {formatPrice(variant.product.price)}
                  </span>
                  <div className="w-8 h-8 border border-black/20 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-300">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-black group-hover:stroke-white transition-colors duration-300"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View all CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/products"
            className="border border-black text-black font-bold uppercase py-4 px-12 text-[0.65rem] tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-300"
          >
            View Full Catalog
          </Link>
        </div>
      </div>

      {/* Floating hover image */}
      <div
        ref={floatingImgRef}
        className="fixed top-0 left-0 w-48 h-60 pointer-events-none z-50 transition-opacity duration-300"
        style={{ opacity: hoveredIndex !== null ? 1 : 0 }}
      >
        {hoveredIndex !== null && variants[hoveredIndex] && (
          <Image
            src={variants[hoveredIndex].variantImages?.[0]?.url || '/placeholder.jpg'}
            alt={variants[hoveredIndex].product.title}
            fill
            className="object-cover"
            sizes="192px"
          />
        )}
      </div>
    </section>
  );
}