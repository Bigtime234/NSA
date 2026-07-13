"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

const sports = [
  { label: "All", value: "" },
  { label: "Football", value: "football" },
  { label: "Basketball", value: "basketball" },
  { label: "Tennis", value: "tennis" },
  { label: "Boxing", value: "boxing" },
  { label: "Badminton", value: "badminton" },
  { label: "Handball", value: "handball" },
]

export default function ProductTags() {
  const router = useRouter()
  const params = useSearchParams()
  const category = params.get("category") || ""
  const search = params.get("search") || ""
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      gsap.registerPlugin(ScrollTrigger)

      gsap.set(headingRef.current, { y: 40, opacity: 0 })
      gsap.set(filtersRef.current, { y: 30, opacity: 0 })

      gsap.to(headingRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      })

      gsap.to(filtersRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      })
    }
    init()
  }, [])

  const updateURL = useCallback(
    (newCategory: string, newSearch: string) => {
      const query = new URLSearchParams()
      if (newCategory) query.set("category", newCategory)
      if (newSearch) query.set("search", newSearch)
      startTransition(() => {
        router.replace(`/?${query.toString()}`, { scroll: false })
      })
    },
    [router]
  )

  // Debounce search — only fires the server request 400ms after the user
  // stops typing, instead of on every single keystroke
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        updateURL(category, value)
      }, 400)
    },
    [category, updateURL]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleFilter = (value: string) => {
    // Filter clicks stay instant — no debounce needed, it's a single deliberate action
    updateURL(value, search)
  }

  const clearSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (inputRef.current) inputRef.current.value = ""
    updateURL(category, "")
  }

  return (
    <section ref={sectionRef} className="w-full bg-white border-t border-black/10">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-16 md:py-20">

        {/* Shop section heading */}
        <div ref={headingRef} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6" style={{ opacity: 1 }}>
          <div>
            <p className="text-black/40 font-semibold uppercase mb-3 tracking-[0.45em] text-xs">
              Browse Collection
            </p>
            <h2 className="text-5xl md:text-6xl font-black uppercase text-black leading-none">
              Shop<br />
              <span className="text-black/20">All.</span>
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-sm">
            <Search
              size={13}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
            />
            <input
              ref={inputRef}
              type="text"
              defaultValue={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-10 py-3.5 border border-black/20 bg-white text-black font-semibold text-sm tracking-wide placeholder:text-black/30 placeholder:font-normal focus:outline-none focus:border-black transition-colors duration-200"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
              >
                <X size={13} />
              </button>
            )}
            {isPending && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-3 h-3 border border-black/20 border-t-black rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Sport filter buttons */}
        <div ref={filtersRef} className="flex items-center gap-3 flex-wrap" style={{ opacity: 1 }}>
          {sports.map((sport) => (
            <button
              key={sport.value}
              onClick={() => handleFilter(sport.value)}
              className={cn(
                "px-5 py-2.5 border font-bold uppercase transition-all duration-300",
                "text-[0.6rem] tracking-[0.3em]",
                category === sport.value || (!category && sport.value === "")
                  ? "bg-black text-white border-black"
                  : "bg-white text-black/50 border-black/15 hover:border-black hover:text-black hover:bg-black/5"
              )}
            >
              {sport.label}
            </button>
          ))}

          {/* Clear all */}
          {(category || search) && (
            <button
              onClick={() => {
                if (inputRef.current) inputRef.current.value = ""
                router.replace("/", { scroll: false })
              }}
              className="ml-auto flex items-center gap-2 text-black/40 hover:text-black transition-colors duration-200 uppercase font-bold tracking-[0.2em]"
              style={{ fontSize: "0.6rem" }}
            >
              <X size={11} />
              Clear all
            </button>
          )}
        </div>

        {/* Active filters display */}
        {(category || search) && (
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            {category && (
              <div className="flex items-center gap-2 border border-black/10 px-3 py-1.5">
                <span className="text-black/50 uppercase font-bold tracking-[0.2em]" style={{ fontSize: "0.55rem" }}>
                  Category:
                </span>
                <span className="text-black font-black uppercase tracking-[0.2em]" style={{ fontSize: "0.55rem" }}>
                  {category}
                </span>
              </div>
            )}
            {search && (
              <div className="flex items-center gap-2 border border-black/10 px-3 py-1.5">
                <span className="text-black/50 uppercase font-bold tracking-[0.2em]" style={{ fontSize: "0.55rem" }}>
                  Search:
                </span>
                <span className="text-black font-black uppercase tracking-[0.2em]" style={{ fontSize: "0.55rem" }}>
                  "{search}"
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}