"use client"

import Link from "next/link"
import { useCartStore } from "@/lib/client-store"
import Lottie from "lottie-react"
import { motion } from "framer-motion"
import orderConfirmed from "@/public/order-confirmed.json"
import { ArrowRight, CheckCircle } from "lucide-react"

export default function OrderConfirmed() {
  const { setCheckoutProgress, setCartOpen } = useCartStore()
  return (
    <div className="flex flex-col items-center py-12 px-4">
      
      {/* Animation */}
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <Lottie className="h-40" animationData={orderConfirmed} />
      </motion.div>

      {/* Check icon */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center text-center mt-4"
      >
        <div className="w-12 h-12 bg-black flex items-center justify-center mb-6">
          <CheckCircle size={20} className="text-white" />
        </div>

        <p className="text-black/40 font-bold uppercase tracking-[0.4em] text-[0.6rem] mb-2">
          Order Placed
        </p>
        <h2 className="text-black font-black uppercase text-3xl tracking-tight mb-4">
          Thank You!
        </h2>
        <p className="text-black/50 leading-relaxed max-w-xs mb-3" style={{ fontSize: "0.8rem" }}>
          Your order has been received. Payment is verified manually,
          so this can take up to 20 minutes.
        </p>
        <p className="text-black/50 leading-relaxed max-w-xs" style={{ fontSize: "0.8rem" }}>
          Check <strong className="text-black">My Orders</strong> in a
          little while — your status will update to{" "}
          <strong className="text-black">Confirmed</strong> once we've
          verified your payment.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.6 }}
        className="w-full mt-10"
      >
        <Link href="/dashboard/orders" className="block w-full">
          <button
            onClick={() => {
              setCheckoutProgress("cart-page")
              setCartOpen(false)
            }}
            className="w-full bg-black text-white font-black uppercase tracking-[0.3em] py-4 text-[0.7rem] hover:bg-black/80 transition-all duration-300 flex items-center justify-center gap-3"
          >
            View Your Order
            <ArrowRight size={14} />
          </button>
        </Link>
      </motion.div>
    </div>
  )
}