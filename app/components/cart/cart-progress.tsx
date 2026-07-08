"use client"

import { motion } from "framer-motion"
import { useCartStore } from "@/lib/client-store"
import { ShoppingBag, CreditCard, Check } from "lucide-react"

const steps = [
  { id: "cart-page", label: "Bag", icon: ShoppingBag },
  { id: "payment-page", label: "Payment", icon: CreditCard },
  { id: "confirmation-page", label: "Confirmed", icon: Check },
]

export default function CartProgress() {
  const { checkoutProgress } = useCartStore()

  const activeIndex = steps.findIndex((s) => s.id === checkoutProgress)

  return (
    <div className="px-6 py-4 border-b border-black/10">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-4 right-4 h-[1px] bg-black/10 z-0" />
        <motion.div
          className="absolute top-4 left-4 h-[1px] bg-black z-0"
          initial={{ width: 0 }}
          animate={{
            width:
              checkoutProgress === "cart-page"
                ? "0%"
                : checkoutProgress === "payment-page"
                ? "50%"
                : "100%",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const isActive = index <= activeIndex
          const Icon = step.icon
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-8 h-8 flex items-center justify-center border transition-all duration-300 ${
                  isActive
                    ? "bg-black border-black"
                    : "bg-white border-black/20"
                }`}
              >
                <Icon
                  size={14}
                  className={isActive ? "text-white" : "text-black/30"}
                />
              </motion.div>
              <span
                className={`uppercase font-bold tracking-[0.2em] transition-colors duration-300 ${
                  isActive ? "text-black" : "text-black/30"
                }`}
                style={{ fontSize: "0.5rem" }}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}