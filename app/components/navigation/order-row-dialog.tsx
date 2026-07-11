"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Package, User, Phone, MapPin, Mail,
  MessageCircle, MoreHorizontal, CalendarClock, Truck
} from "lucide-react"
import Image from "next/image"
import { getDispatchLabel } from "@/lib/dispatch-fees"
import formatPrice from "@/lib/format-price"
import { OrderActions } from "@/app/components/navigation/order-actions"

function formatOrderDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

function friendlyStatus(status: string) {
  const map: Record<string, string> = {
    pending: "Awaiting Verification",
    processing: "Processing",
    succeeded: "Confirmed",
    completed: "Delivered",
    cancelled: "Cancelled",
  }
  return map[status] ?? status
}

type OrderProductType = {
  product: { id: number; title: string; price: number }
  productVariants: { id: number; color: string; variantImages: { url: string }[] }
  quantity: number
  size: string | null
  playerName: string | null
  playerNumber: string | null
}

type OrderType = {
  id: number
  userID: string
  created: Date | null
  total: number
  status: string
  paymentMethod: string | null
  customerName: string | null
  customerEmail: string | null
  customerPhone: string | null
  customerWhatsapp: string | null
  shippingAddress: string | null
  shippingCity: string | null
  shippingState: string | null
  shippingPostalCode: string | null
  dispatchLocation: string | null
  dispatchFee: number | null
  orderProduct: OrderProductType[]
}

export function OrderRowDialog({ order, isAdmin }: { order: OrderType; isAdmin: boolean }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setDropdownOpen(false)
              // Open the dialog only after the dropdown has fully closed —
              // avoids the Radix Dialog/DropdownMenu portal conflict
              setTimeout(() => setDialogOpen(true), 0)
            }}
          >
            View details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order #{order.id}
              {isAdmin && <Badge variant="secondary">Admin View</Badge>}
            </DialogTitle>
            <DialogDescription>Order details and information</DialogDescription>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              <span>
                Placed on {order.created ? formatOrderDate(new Date(order.created).toISOString()) : "N/A"}
              </span>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">Order Status</h3>
                    <Badge
                      className={cn({
                        "bg-yellow-100 text-yellow-800": order.status === "pending",
                        "bg-blue-100 text-blue-800": order.status === "processing",
                        "bg-green-100 text-green-800": order.status === "succeeded",
                        "bg-purple-100 text-purple-800": order.status === "completed",
                        "bg-red-100 text-red-800": order.status === "cancelled",
                      })}
                    >
                      {friendlyStatus(order.status)}
                    </Badge>
                  </div>
                  {isAdmin && order.status === "pending" && (
                    <OrderActions orderId={order.id.toString()} />
                  )}
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{order.customerEmail || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{order.customerPhone || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <p>{order.customerWhatsapp || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-medium">{order.customerName || "N/A"}</p>
                  <p>{order.shippingAddress || "N/A"}</p>
                  <p>
                    {order.shippingCity || "N/A"}, {order.shippingState || "N/A"} {order.shippingPostalCode || ""}
                  </p>
                  <div className="pt-2 mt-2 border-t flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Dispatch Location</p>
                      <p className="font-medium">
                        {order.dispatchLocation ? getDispatchLabel(order.dispatchLocation) : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {order.orderProduct.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5" />
                    Ordered Items (Total: {order.orderProduct.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Personalization</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.orderProduct.map(({ product, productVariants, quantity, size, playerName, playerNumber }) => (
                        <TableRow key={`${product.id}-${productVariants.id}`}>
                          <TableCell>
                            <Image
                              src={productVariants.variantImages[0]?.url || "/placeholder.jpg"}
                              width={60}
                              height={60}
                              alt={product.title}
                              className="rounded-md object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.title}</TableCell>
                          <TableCell>
                            {size ? <Badge variant="outline">{size}</Badge> : <span className="text-muted-foreground text-xs">—</span>}
                          </TableCell>
                          <TableCell>
                            {(playerName || playerNumber) ? (
                              <span className="text-sm font-medium">{playerName} {playerNumber}</span>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell>{quantity}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatPrice(product.price * quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Dispatch Fee ({order.dispatchLocation ? getDispatchLabel(order.dispatchLocation) : "N/A"})
                      </span>
                      <span className="font-medium">{formatPrice(order.dispatchFee || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-lg font-semibold">Order Total:</span>
                      <span className="text-2xl font-bold">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}