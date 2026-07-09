"use client"

import { useState } from "react"
import { Package, User, Phone, MessageCircle, MapPin, Copy, Check } from "lucide-react"
import Image from "next/image"
import { useCartStore } from "@/lib/client-store"
import { createOrder } from "@/lib/actions/create-order"
import { toast } from "sonner"
import { useAction } from "next-safe-action/hooks"
import formatPrice from "@/lib/format-price"
import { getDispatchLabel } from "@/lib/dispatch-fees"

type FormData = {
  fullName: string
  email: string
  phone: string
  whatsapp: string
  address: string
  city: string
  state: string
  postalCode: string
  paymentMethod: string
}

const inputClass =
  "w-full px-4 py-3 border border-black/15 bg-white text-black font-semibold text-sm placeholder:text-black/25 placeholder:font-normal focus:outline-none focus:border-black transition-colors duration-200"

const labelClass =
  "block text-black/50 font-bold uppercase tracking-[0.25em] mb-2"

export default function Payment() {
  const { cart, clearCart, setCheckoutProgress, dispatchLocation, dispatchFee } =
    useCartStore()
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    paymentMethod: "palmpay",
  })
  const [copied, setCopied] = useState(false)

  const accountNumber = "9166813017"
  const accountName = "NSA Official"

  const itemsTotal = cart.reduce((sum, item) => {
    return sum + item.price * item.variant.quantity
  }, 0)

  const total = itemsTotal + dispatchFee

  const { execute, status } = useAction(createOrder, {
    onSuccess: ({ data }) => {
      if ((data as { success?: boolean })?.success) {
        clearCart()
        toast.success("Order placed successfully!")
        setCheckoutProgress("confirmation-page")
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to create order")
    },
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    if (!dispatchLocation) {
      toast.error("Please select a delivery location")
      return
    }

    const requiredFields: (keyof FormData)[] = [
      "fullName", "email", "phone", "whatsapp",
      "address", "city", "state", "postalCode",
    ]
    const missingFields = requiredFields.filter((field) => !formData[field])
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields")
      return
    }

    execute({
      products: cart.map((item) => ({
        productID: item.id,
        variantID: item.variant.variantID,
        quantity: item.variant.quantity,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.size,
        playerName: item.playerName,
        playerNumber: item.playerNumber,
      })),
      status: "pending",
      total,
      customerInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
      },
      paymentMethod: formData.paymentMethod,
      dispatchLocation,
      dispatchFee,
    })
  }

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Package size={40} className="text-black/20 mb-4" />
        <p className="text-black font-black uppercase text-lg tracking-tight">
          Cart is empty
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 py-6">

      {/* Order summary */}
      <div>
        <p className={labelClass} style={{ fontSize: "0.55rem" }}>
          Order Summary
        </p>
        <div className="border border-black/10 divide-y divide-black/10">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.variant.variantID}`}
              className="flex items-center gap-4 p-4"
            >
              <div className="relative w-12 h-14 bg-black/5 flex-shrink-0 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-black font-black uppercase text-sm truncate tracking-tight">
                  {item.name}
                </p>
                <p className="text-black/40 uppercase font-bold tracking-[0.2em]"
                  style={{ fontSize: "0.55rem" }}>
                  Qty: {item.variant.quantity}
                </p>
              </div>
              <span className="text-black font-black text-sm shrink-0">
                {formatPrice(item.price * item.variant.quantity)}
              </span>
            </div>
          ))}

          {/* Subtotal */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-black/50 font-bold uppercase tracking-[0.3em]"
              style={{ fontSize: "0.6rem" }}>
              Subtotal
            </span>
            <span className="text-black font-bold text-sm">
              {formatPrice(itemsTotal)}
            </span>
          </div>

          {/* Dispatch fee */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-black/50 font-bold uppercase tracking-[0.3em]"
              style={{ fontSize: "0.6rem" }}>
              Dispatch Fee ({getDispatchLabel(dispatchLocation)})
            </span>
            <span className="text-black font-bold text-sm">
              {formatPrice(dispatchFee)}
            </span>
          </div>

          {/* Grand total */}
          <div className="flex items-center justify-between p-4 bg-black/[0.02]">
            <span className="text-black/50 font-bold uppercase tracking-[0.3em]"
              style={{ fontSize: "0.6rem" }}>
              Total
            </span>
            <span className="text-black font-black text-lg">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <User size={14} className="text-black/40" />
          <p className={labelClass} style={{ fontSize: "0.55rem" }}>
            Personal Information
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ fontSize: "0.5rem" }}>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName}
              onChange={handleInputChange} placeholder="Your full name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} style={{ fontSize: "0.5rem" }}>Email</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleInputChange} placeholder="your@email.com" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Phone size={14} className="text-black/40" />
          <p className={labelClass} style={{ fontSize: "0.55rem" }}>
            Contact
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ fontSize: "0.5rem" }}>Phone</label>
            <input type="tel" name="phone" value={formData.phone}
              onChange={handleInputChange} placeholder="+234 xxx xxx xxxx" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} style={{ fontSize: "0.5rem" }}>WhatsApp</label>
            <div className="relative">
              <MessageCircle size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
              <input type="tel" name="whatsapp" value={formData.whatsapp}
                onChange={handleInputChange} placeholder="+234 xxx xxx xxxx"
                className={`${inputClass} pl-10`} />
            </div>
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={14} className="text-black/40" />
          <p className={labelClass} style={{ fontSize: "0.55rem" }}>
            Shipping Address
          </p>
        </div>

        {/* Selected delivery location reminder */}
        <div className="flex items-center justify-between border border-black/10 bg-black/[0.02] px-4 py-3 mb-4">
          <span className="text-black/50 font-bold uppercase tracking-[0.2em]" style={{ fontSize: "0.55rem" }}>
            Delivery Location
          </span>
          <span className="text-black font-black uppercase text-sm">
            {getDispatchLabel(dispatchLocation)}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass} style={{ fontSize: "0.5rem" }}>Street Address</label>
            <textarea name="address" value={formData.address}
              onChange={handleInputChange} rows={2} placeholder="Enter your full address"
              className={`${inputClass} resize-none`} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass} style={{ fontSize: "0.5rem" }}>City</label>
              <input type="text" name="city" value={formData.city}
                onChange={handleInputChange} placeholder="City" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} style={{ fontSize: "0.5rem" }}>State</label>
              <input type="text" name="state" value={formData.state}
                onChange={handleInputChange} placeholder="State" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} style={{ fontSize: "0.5rem" }}>Postal Code</label>
              <input type="text" name="postalCode" value={formData.postalCode}
                onChange={handleInputChange} placeholder="100001" className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div>
        <p className={labelClass} style={{ fontSize: "0.55rem" }}>
          Payment Method
        </p>
        <div className="border border-black/10 p-5">
          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-black/10">
            <div className="relative w-10 h-10 overflow-hidden">
              <Image src="/Palmpay.jpg" alt="PalmPay" fill className="object-contain" />
            </div>
            <div>
              <p className="text-black font-black uppercase text-sm tracking-tight">PalmPay</p>
              <p className="text-black/40 uppercase font-bold tracking-[0.2em]"
                style={{ fontSize: "0.5rem" }}>
                Instant bank transfer
              </p>
            </div>
            <div className="ml-auto w-4 h-4 border-2 border-black flex items-center justify-center">
              <div className="w-2 h-2 bg-black" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className={labelClass} style={{ fontSize: "0.5rem" }}>Account Number</p>
              <div className="flex items-center justify-between border border-black/10 px-4 py-3">
                <span className="font-mono font-black text-black text-base tracking-widest">
                  {accountNumber}
                </span>
                <button
                  onClick={copyAccountNumber}
                  className="flex items-center gap-1.5 text-black/40 hover:text-black transition-colors duration-200"
                >
                  {copied ? <Check size={14} className="text-black" /> : <Copy size={14} />}
                  <span className="uppercase font-bold tracking-[0.2em]" style={{ fontSize: "0.5rem" }}>
                    {copied ? "Copied" : "Copy"}
                  </span>
                </button>
              </div>
            </div>
            <div>
              <p className={labelClass} style={{ fontSize: "0.5rem" }}>Account Name</p>
              <div className="border border-black/10 px-4 py-3">
                <span className="text-black font-black uppercase tracking-tight text-sm">
                  {accountName}
                </span>
              </div>
            </div>
            <div>
              <p className={labelClass} style={{ fontSize: "0.5rem" }}>Amount to Transfer</p>
              <div className="border border-black px-4 py-3 bg-black">
                <span className="text-white font-black text-lg">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-black/10">
            <p className="text-black/50 leading-relaxed" style={{ fontSize: "0.7rem" }}>
              Transfer the exact amount above (including dispatch fee) to the account
              details provided. Your order will be confirmed after payment verification.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === "executing"}
        className="w-full bg-black text-white font-black uppercase tracking-[0.3em] py-4 text-[0.7rem] hover:bg-black/80 transition-all duration-300 disabled:opacity-30 flex items-center justify-center gap-3"
      >
        {status === "executing" ? (
          <>
            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          "Complete Order"
        )}
      </button>
    </div>
  )
}