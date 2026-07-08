"use client"

import { useCartStore } from "@/lib/client-store"
import { useState } from "react"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { redirect, useSearchParams } from "next/navigation"

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
  }
}

export default function AddCart({ variant, fallbackData }: AddCartProps) {
  const { addToCart } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const params = useSearchParams()

  const urlId = Number(params.get("id"))
  const urlProductID = Number(params.get("productID"))
  const urlTitle = params.get("title")
  const urlType = params.get("type")
  const urlPrice = Number(params.get("price"))
  const urlImage = params.get("image")

  let productData: any = null

  if (urlId && urlProductID && urlTitle && urlType && urlPrice && urlImage) {
    productData = {
      id: urlId,
      productID: urlProductID,
      title: urlTitle,
      type: urlType,
      price: urlPrice,
      image: urlImage,
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
    }
  } else if (fallbackData) {
    productData = fallbackData
  }

  if (!productData) {
    toast.error("Product not found")
    return redirect("/")
  }

  const handleAddToCart = () => {
    toast.success(`${productData.title} added to cart!`)
    addToCart({
      id: productData.productID,
      variant: { variantID: productData.id, quantity },
      name: `${productData.title} ${productData.type}`,
      price: productData.price,
      image: productData.image,
    })
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
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