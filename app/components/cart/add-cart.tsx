"use client"

import { useCartStore } from "@/lib/client-store"
import { useState } from "react"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { redirect, useSearchParams } from "next/navigation"

const SIZES = ["S", "M", "L", "XL", "XXL"]

interface AddCartProps {
  variant?: {
    id: number
    productID: number
    productType: string
    color: string
    product: {
      id: number
      title: string
      price: number
      description: string
      itemType?: string
      productVariants: Array<{
        variantImages: Array<{ url: string }>
      }>
    }
  }
  fallbackData?: {
    id: number
    productID: number
    title: string
    type: string
    price: number
    image: string
    itemType?: string
  }
}

export default function AddCart({ variant, fallbackData }: AddCartProps) {
  const { addToCart } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState<string>("")
  const [playerName, setPlayerName] = useState("")
  const [playerNumber, setPlayerNumber] = useState("")
  const params = useSearchParams()

  const urlId = Number(params.get("id"))
  const urlProductID = Number(params.get("productID"))
  const urlTitle = params.get("title")
  const urlType = params.get("type")
  const urlPrice = Number(params.get("price"))
  const urlImage = params.get("image")
  const urlItemType = params.get("itemType") || "apparel"

  let productData: any = null

  if (urlId && urlProductID && urlTitle && urlType && urlPrice && urlImage) {
    productData = {
      id: urlId,
      productID: urlProductID,
      title: urlTitle,
      type: urlType,
      price: urlPrice,
      image: urlImage,
      itemType: urlItemType,
    }
  } else if (variant) {
    productData = {
      id: variant.id,
      productID: variant.product.id,
      title: variant.product.title,
      type: variant.productType,
      price: variant.product.price,
      image:
        variant.product.productVariants?.[0]?.variantImages?.[0]?.url ||
        "/placeholder.jpg",
      itemType: variant.product.itemType ?? "apparel",
    }
  } else if (fallbackData) {
    productData = { ...fallbackData, itemType: fallbackData.itemType ?? "apparel" }
  }

  if (!productData) {
    toast.error("Product not found")
    return redirect("/")
  }

  const isApparel = productData.itemType === "apparel"

  const handleAddToCart = () => {
    if (isApparel && !size) {
      toast.error("Please select a size")
      return
    }

    if (isApparel && playerNumber && !/^\d{1,2}$/.test(playerNumber)) {
      toast.error("Number must be 1-2 digits")
      return
    }

    toast.success(`${productData.title} added to cart!`)
    addToCart({
      id: productData.productID,
      variant: { variantID: productData.id, quantity },
      name: `${productData.title} ${productData.type}`,
      price: productData.price,
      image: productData.image,
      size: isApparel ? size : undefined,
      playerName: isApparel ? (playerName.trim() || undefined) : undefined,
      playerNumber: isApparel ? (playerNumber.trim() || undefined) : undefined,
    })

    setPlayerName("")
    setPlayerNumber("")
  }

  return (
    <div className="flex flex-col gap-6 mt-4">

      {/* Size selector — apparel only */}
      {isApparel && (
        <div>
          <span
            className="text-black/40 font-bold uppercase tracking-[0.3em] block mb-3"
            style={{ fontSize: "0.6rem" }}
          >
            Select Size
          </span>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`w-12 h-12 border font-bold text-sm transition-all duration-200 ${
                  size === s
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black/20 hover:border-black"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Personalization — apparel only */}
      {isApparel && (
        <div>
          <span
            className="text-black/40 font-bold uppercase tracking-[0.3em] block mb-3"
            style={{ fontSize: "0.6rem" }}
          >
            Personalize (Optional)
          </span>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
              placeholder="Name"
              maxLength={12}
              className="border border-black/15 px-4 py-3 text-sm font-semibold uppercase tracking-wide placeholder:text-black/25 placeholder:font-normal placeholder:normal-case focus:outline-none focus:border-black transition-colors duration-200"
            />
            <input
              type="text"
              value={playerNumber}
              onChange={(e) => setPlayerNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="Number"
              maxLength={2}
              inputMode="numeric"
              className="border border-black/15 px-4 py-3 text-sm font-semibold placeholder:text-black/25 placeholder:font-normal focus:outline-none focus:border-black transition-colors duration-200"
            />
          </div>
          <p className="text-black/30 mt-2" style={{ fontSize: "0.6rem" }}>
            Add a name and number to personalize your jersey — free of charge.
          </p>
        </div>
      )}

      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span
          className="text-black/40 font-bold uppercase tracking-[0.3em]"
          style={{ fontSize: "0.6rem" }}
        >
          Quantity
        </span>
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            disabled={quantity <= 1}
            className="w-9 h-9 border border-black/20 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-200 disabled:opacity-30"
          >
            <Minus size={12} />
          </button>
          <span className="text-black font-black text-lg w-6 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-9 h-9 border border-black/20 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-200"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-black text-white font-black uppercase tracking-[0.3em] py-4 text-[0.7rem] hover:bg-black/80 transition-all duration-300 flex items-center justify-center gap-3"
      >
        <ShoppingBag size={14} />
        Add to Cart
      </button>
    </div>
  )
}