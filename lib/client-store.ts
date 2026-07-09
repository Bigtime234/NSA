import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Variant = {
  variantID: number
  quantity: number
}

export type CartItem = {
  name: string
  image: string
  id: number
  variant: Variant
  price: number
  // Jersey customization
  size?: string
  playerName?: string
  playerNumber?: string
}

export type CartState = {
  cart: CartItem[]
  checkoutProgress: "cart-page" | "payment-page" | "confirmation-page"
  setCheckoutProgress: (
    val: "cart-page" | "payment-page" | "confirmation-page"
  ) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (item: CartItem) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (val: boolean) => void
  dispatchLocation: string
  dispatchFee: number
  setDispatchLocation: (location: string, fee: number) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      cartOpen: false,
      setCartOpen: (val) => set({ cartOpen: val }),
      clearCart: () => set({ cart: [] }),
      checkoutProgress: "cart-page",
      setCheckoutProgress: (val) => set(() => ({ checkoutProgress: val })),

      dispatchLocation: "",
      dispatchFee: 0,
      setDispatchLocation: (location, fee) =>
        set({ dispatchLocation: location, dispatchFee: fee }),

      addToCart: (item) =>
        set((state) => {
          // Match by variantID AND size AND playerName/playerNumber so different
          // customizations of the same jersey stack as separate line items
          const existingItem = state.cart.find(
            (cartItem) =>
              cartItem.variant.variantID === item.variant.variantID &&
              cartItem.size === item.size &&
              cartItem.playerName === item.playerName &&
              cartItem.playerNumber === item.playerNumber
          )

          if (existingItem) {
            const updatedCart = state.cart.map((cartItem) => {
              if (
                cartItem.variant.variantID === item.variant.variantID &&
                cartItem.size === item.size &&
                cartItem.playerName === item.playerName &&
                cartItem.playerNumber === item.playerNumber
              ) {
                return {
                  ...cartItem,
                  variant: {
                    ...cartItem.variant,
                    quantity: cartItem.variant.quantity + item.variant.quantity,
                  },
                }
              }
              return cartItem
            })
            return { cart: updatedCart }
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  ...item,
                  variant: {
                    variantID: item.variant.variantID,
                    quantity: item.variant.quantity,
                  },
                },
              ],
            }
          }
        }),
      removeFromCart: (item) =>
        set((state) => {
          const updatedCart = state.cart.map((cartItem) => {
            if (
              cartItem.variant.variantID === item.variant.variantID &&
              cartItem.size === item.size &&
              cartItem.playerName === item.playerName &&
              cartItem.playerNumber === item.playerNumber
            ) {
              return {
                ...cartItem,
                variant: {
                  ...cartItem.variant,
                  quantity: cartItem.variant.quantity - 1,
                },
              }
            }
            return cartItem
          })
          return {
            cart: updatedCart.filter((item) => item.variant.quantity > 0),
          }
        }),
    }),
    { name: "cart-storage" }
  )
)