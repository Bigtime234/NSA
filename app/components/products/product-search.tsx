"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"
import { Search, X } from "lucide-react"

export default function ProductSearch() {
  const router = useRouter()
  const params = useSearchParams()
  const search = params.get("search") || ""
  const category = params.get("category") || ""
  const [isPending, startTransition] = useTransition()

  const handleSearch = useCallback(
    (value: string) => {
      const query = new URLSearchParams()
      if (category) query.set("category", category)
      if (value) query.set("search", value)
      startTransition(() => {
        router.push(`/?${query.toString()}`)
      })
    },
    [category, router]
  )

  const clearSearch = () => {
    const query = new URLSearchParams()
    if (category) query.set("category", category)
    router.push(`/?${query.toString()}`)
  }

  return (
    <div className="flex items-center justify-center px-6 mb-6">
      <div className="relative w-full max-w-md">
        <Search
          size={14}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
        />
        <input
          type="text"
          defaultValue={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-3 border border-black/20 bg-white text-black font-semibold text-sm uppercase tracking-[0.1em] placeholder:text-black/30 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-black transition-colors duration-200"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
          >
            <X size={14} />
          </button>
        )}
        {isPending && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}