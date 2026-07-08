"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardNav({
  allLinks,
}: {
  allLinks: { label: string; path: string; icon: React.JSX.Element }[]
}) {
  const pathname = usePathname()

  return (
    <nav className="py-6 mb-8 border-b border-black/10 overflow-x-auto">
      <ul className="flex gap-8 md:gap-10">
        <AnimatePresence>
          {allLinks.map((link) => {
            const isActive = pathname === link.path
            return (
              <motion.li whileTap={{ scale: 0.95 }} key={link.path} className="shrink-0">
                <Link
                  className={cn(
                    "flex items-center gap-2 relative pb-4 font-bold uppercase tracking-[0.2em] transition-colors duration-200",
                    isActive ? "text-black" : "text-black/40 hover:text-black"
                  )}
                  href={link.path}
                  style={{ fontSize: "0.65rem" }}
                >
                  {link.icon}
                  {link.label}
                  {isActive && (
                    <motion.div
                      className="h-[2px] w-full absolute bg-black z-0 left-0 -bottom-[1px]"
                      initial={{ scaleX: 0.5, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      layoutId="dashboard-underline"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </nav>
  )
}