"use client"

import { useCartStore } from "@/lib/client-store"
import { motion } from "framer-motion"
import { DrawerTitle } from "@/components/ui/drawer"
import { ArrowLeft } from "lucide-react"

export default function CartMessage() {
  const { checkoutProgress, setCheckoutProgress } = useCartStore()
  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: 10 }}
    >
      {checkoutProgress === "cart-page" && (
        <div>
          <p className="text-black/40 font-bold uppercase tracking-[0.4em] text-[0.6rem] mb-1">
            Your Bag
          </p>
          <DrawerTitle className="text-black font-black uppercase text-2xl tracking-tight">
            Cart
          </DrawerTitle>
        </div>
      )}
      {checkoutProgress === "payment-page" && (
        <div>
          <button
            onClick={() => setCheckoutProgress("cart-page")}
            className="flex items-center gap-2 text-black/40 hover:text-black transition-colors duration-200 uppercase font-bold tracking-[0.2em] text-[0.6rem] mb-2"
          >
            <ArrowLeft size={11} />
            Back to cart
          </button>
          <DrawerTitle className="text-black font-black uppercase text-2xl tracking-tight">
            Checkout
          </DrawerTitle>
        </div>
      )}
      {checkoutProgress === "confirmation-page" && (
        <div>
          <p className="text-black/40 font-bold uppercase tracking-[0.4em] text-[0.6rem] mb-1">
            Order Placed
          </p>
          <DrawerTitle className="text-black font-black uppercase text-2xl tracking-tight">
            Confirmed
          </DrawerTitle>
        </div>
      )}
    </motion.div>
  )
}