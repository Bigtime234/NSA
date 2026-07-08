'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const scrollLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let gsap: any
    let ScrollTrigger: any

    const init = async () => {
      const gsapMod = await import('gsap')
      const stMod = await import('gsap/ScrollTrigger')
      gsap = gsapMod.gsap
      ScrollTrigger = stMod.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      gsap.set(titleRef.current, { yPercent: 110, opacity: 0 })
      gsap.set(subtitleRef.current, { y: 30, opacity: 0 })
      gsap.set(ctaRef.current, { y: 20, opacity: 0 })

      const tl = gsap.timeline({ delay: 0.2 })
      tl.to(overlayRef.current, {
        xPercent: 101,
        duration: 1.4,
        ease: 'power4.inOut',
      })
        .to(imgRef.current, { scale: 1, duration: 1.4, ease: 'power4.out' }, '-=1.4')
        .to(titleRef.current, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }, '-=0.8')
        .to(subtitleRef.current, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.7')
        .to(ctaRef.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')

      if (scrollLineRef.current) {
        gsap.to(scrollLineRef.current, {
          yPercent: 200,
          repeat: -1,
          duration: 1.5,
          ease: 'power1.inOut',
        })
      }

      gsap.to(imgRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        yPercent: -15,
        ease: 'none',
      })
    }

    init()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-end pb-20 overflow-hidden bg-black"
    >
      {/* Hero image */}
      <div className="absolute inset-0">
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black z-[2]"
        />
        <div ref={imgRef} className="relative w-full h-full" style={{ transform: 'scale(1.12)' }}>
          <Image
            src="/hero-main.jpg"
            alt="Elite athlete in motion, dark dramatic studio lighting, monochromatic intensity"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        {/* Dark scrim for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 z-[1]" />
      </div>

      {/* Editorial secondary image — right side panel */}
      <div className="absolute right-0 top-0 h-full w-[38%] z-[2] hidden lg:block overflow-hidden">
        <div
          className="absolute inset-0 z-[1]"
          style={{ clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        >
          <Image
            src="/melanin-jersey.jpg"
            alt="Model wearing NSA jersey, editorial fashion photography"
            fill
            priority
            className="object-cover object-top"
            sizes="38vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-[1]" />
        </div>
        <div className="absolute left-[11%] top-0 h-full w-[1px] bg-white/10 z-[2]" />
        <div className="absolute bottom-24 right-8 z-[3] text-right">
          <p className="text-white/40 text-[0.5rem] tracking-[0.4em] uppercase font-semibold">SS26 Drop</p>
          <p className="text-white/60 text-[0.65rem] tracking-[0.3em] uppercase font-bold mt-1">New Arrival</p>
        </div>
      </div>

      {/* Vertical side labels */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center gap-3">
        <div
          className="text-white/30 text-[0.55rem] font-semibold uppercase tracking-[0.4em]"
          style={{ writingMode: 'vertical-rl' }}
        >
          SS26 / Sport Identity
        </div>
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center gap-3">
        <div
          className="text-white/30 text-[0.55rem] font-semibold uppercase tracking-[0.4em]"
          style={{ writingMode: 'vertical-rl' }}
        >
          Premium Athletic Wear
        </div>
      </div>

      {/* Wordmark overlay — decorative background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]">
        <span
          className="text-white font-black uppercase"
          style={{
            fontSize: 'clamp(8rem, 30vw, 32rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.05em',
            opacity: 0.04,
          }}
        >
          NSA
        </span>
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-10 w-full pt-32">
        <div className="max-w-4xl">
          <p
            ref={subtitleRef}
            className="text-white/50 font-semibold uppercase mb-6 tracking-[0.5em]"
            style={{ fontSize: '0.7rem', opacity: 1 }}
          >
            New Season Drop — SS26
          </p>

          <div className="overflow-hidden mb-8">
            <h1
              ref={titleRef}
              className="text-white font-black uppercase leading-none"
              style={{
                fontSize: 'clamp(3.5rem, 12vw, 10rem)',
                letterSpacing: '-0.04em',
                opacity: 1,
              }}
            >
              NSA
            </h1>
          </div>

          <p
            className="text-white/70 max-w-md leading-relaxed mb-10"
            style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}
          >
            Premium sports jerseys and accessories engineered for those who
            play at the highest level — and dress like it.
          </p>

          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{ opacity: 1 }}
          >
            <Link
              href="/products"
              className="bg-white text-black font-black uppercase tracking-[0.2em] px-8 py-4 text-[0.7rem] flex items-center gap-3 hover:bg-white/90 transition-all duration-300"
            >
              Shop Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="border border-white/30 text-white font-black uppercase tracking-[0.2em] px-8 py-4 text-[0.7rem] hover:border-white hover:bg-white/5 transition-all duration-300"
            >
              View Jerseys
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="text-white/30 text-[0.55rem] tracking-[0.5em] uppercase font-semibold">
          Scroll
        </span>
        <div className="w-[1px] h-10 bg-white/10 relative overflow-hidden">
          <div
            ref={scrollLineRef}
            className="absolute top-0 left-0 w-full h-full bg-white/60 -translate-y-full"
          />
        </div>
      </div>
    </section>
  )
}