"use client"
import { useCartStore } from "@/lib/client-store"
import { ShoppingBag } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { AnimatePresence, motion } from "framer-motion"
import CartItems from "./cart-items"
import CartMessage from "./cart-message"
import Payment from "./payment"
import OrderConfirmed from "./order-confirmed"
import CartProgress from "./cart-progress"

export default function CartDrawer() {
  const { cart, checkoutProgress } = useCartStore()
  return (
    <Drawer>
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center -top-1 -right-0.5 w-4 h-4 bg-black text-white text-[0.6rem] font-black rounded-full"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag size={20} className="text-foreground" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] bg-white border-t border-black/10">
        <DrawerHeader className="border-b border-black/10 pb-4">
          <CartMessage />
        </DrawerHeader>
        <CartProgress />
        <div className="px-6 pb-6 overflow-y-auto">
          {checkoutProgress === "cart-page" && <CartItems />}
          {checkoutProgress === "payment-page" && <Payment />}
          {checkoutProgress === "confirmation-page" && <OrderConfirmed />}
        </div>
      </DrawerContent>
    </Drawer>
  )
}