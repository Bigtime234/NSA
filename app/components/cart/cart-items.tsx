"use client"

import { useCartStore } from "@/lib/client-store"
import { AnimatePresence, motion } from "framer-motion"
import { useMemo, useState } from "react"
import formatPrice from "@/lib/format-price"
import Image from "next/image"
import { Minus, Plus, ShoppingBag, X, MapPin, ChevronDown } from "lucide-react"
import Lottie from "lottie-react"
import emptycart from "@/public/empty-box.json"
import { dispatchLocations } from "@/lib/dispatch-fees"

export default function CartItems() {
  const {
    cart,
    addToCart,
    removeFromCart,
    setCheckoutProgress,
    dispatchLocation,
    dispatchFee,
    setDispatchLocation,
  } = useCartStore()

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const itemsTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price! * item.variant.quantity, 0)
  }, [cart])

  const grandTotal = itemsTotal + dispatchFee

  const handleLocationSelect = (value: string, fee: number) => {
    setDispatchLocation(value, fee)
    setDropdownOpen(false)
  }

  const selectedLabel = dispatchLocations.find(
    (loc) => loc.value === dispatchLocation
  )?.label

  return (
    <motion.div className="flex flex-col">
      {cart.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <Lottie className="h-48" animationData={emptycart} />
            <p className="text-black font-black uppercase text-xl tracking-tight mt-4">
              Your bag is empty
            </p>
            <p className="text-black/40 uppercase font-bold tracking-[0.3em] text-[0.6rem] mt-2">
              Add something to get started
            </p>
          </motion.div>
        </div>
      )}

      {cart.length > 0 && (
        <div className="flex flex-col divide-y divide-black/10">
          <AnimatePresence>
            {cart.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.variant.variantID}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 py-5"
              >
                <div className="relative w-16 h-20 bg-black/5 flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className="text-black font-black uppercase truncate tracking-tight"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-black font-bold mt-1">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        removeFromCart({
                          ...item,
                          variant: { ...item.variant, quantity: 1 },
                        })
                      }
                      className="w-7 h-7 border border-black/20 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-200"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-black font-black text-sm w-4 text-center">
                      {item.variant.quantity}
                    </span>
                    <button
                      onClick={() =>
                        addToCart({
                          ...item,
                          variant: { ...item.variant, quantity: 1 },
                        })
                      }
                      className="w-7 h-7 border border-black/20 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-200"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-black font-black text-sm">
                    {formatPrice(item.price * item.variant.quantity)}
                  </span>
                  <button
                    onClick={() =>
                      removeFromCart({
                        ...item,
                        variant: { ...item.variant, quantity: item.variant.quantity },
                      })
                    }
                    className="text-black/20 hover:text-black transition-colors duration-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Dispatch location selector */}
      {cart.length > 0 && (
        <div className="pt-6 mt-2 border-t border-black/10">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={13} className="text-black/40" />
            <span
              className="text-black/50 font-bold uppercase tracking-[0.3em]"
              style={{ fontSize: "0.6rem" }}
            >
              Delivery Location
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between border border-black/15 px-4 py-3 hover:border-black transition-colors duration-200"
            >
              <span
                className={`font-semibold text-sm ${
                  selectedLabel ? "text-black" : "text-black/30"
                }`}
              >
                {selectedLabel || "Select delivery location"}
              </span>
              <ChevronDown
                size={14}
                className={`text-black/40 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/15 max-h-56 overflow-y-auto z-20"
                >
                  {dispatchLocations.map((loc) => (
                    <button
                      key={loc.value}
                      onClick={() => handleLocationSelect(loc.value, loc.fee)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-black hover:text-white transition-colors duration-150 ${
                        dispatchLocation === loc.value ? "bg-black text-white" : "text-black"
                      }`}
                    >
                      <span className="font-semibold text-sm">{loc.label}</span>
                      <span className="font-bold text-xs">{formatPrice(loc.fee)}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Totals + Checkout */}
      {cart.length > 0 && (
        <div className="pt-6 mt-2 border-t border-black/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-black/40 font-bold uppercase tracking-[0.3em]" style={{ fontSize: "0.6rem" }}>
              Subtotal
            </span>
            <span className="text-black font-bold text-sm">
              {formatPrice(itemsTotal)}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-black/40 font-bold uppercase tracking-[0.3em]" style={{ fontSize: "0.6rem" }}>
              Dispatch Fee
            </span>
            <span className="text-black font-bold text-sm">
              {dispatchLocation ? formatPrice(dispatchFee) : "Select location"}
            </span>
          </div>

          <div className="flex items-center justify-between mb-6 pt-4 border-t border-black/10">
            <span
              className="text-black/40 font-bold uppercase tracking-[0.3em]"
              style={{ fontSize: "0.65rem" }}
            >
              Total
            </span>
            <span className="text-black font-black text-xl">
              {formatPrice(grandTotal)}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setCheckoutProgress("payment-page")}
            disabled={cart.length === 0 || !dispatchLocation}
            className="w-full bg-black text-white font-black uppercase tracking-[0.3em] py-4 text-[0.7rem] hover:bg-black/80 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-30"
          >
            <ShoppingBag size={14} />
            {!dispatchLocation ? "Select Delivery Location" : "Checkout"}
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}