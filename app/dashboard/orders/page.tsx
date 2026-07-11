import { db } from "@/server"
import { auth } from "@/server/auth"
import { orders } from "@/server/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Package, Shield,
  CalendarClock, Truck
} from "lucide-react"
import { getDispatchLabel } from "@/lib/dispatch-fees"
import formatPrice from "@/lib/format-price"
import { OrderRowDialog } from "@/app/components/navigation/order-row-dialog"

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
  product: {
    id: number
    title: string
    price: number
  }
  productVariants: {
    id: number
    color: string
    variantImages: { url: string }[]
  }
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
  receiptURL: string | null
  paymentIntentID: string | null
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
  updatedAt: Date | null
  orderProduct: OrderProductType[]
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const isAdmin = session.user.role === "admin"

  const ordersList = await db.query.orders.findMany({
    where: isAdmin ? undefined : eq(orders.userID, session.user.id),
    with: {
      orderProduct: {
        with: {
          product: true,
          productVariants: { with: { variantImages: true } }
        }
      },
    },
    orderBy: (orders, { desc }) => [desc(orders.created)]
  }) as OrderType[]

  return (
    <div className="container mx-auto py-8">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-3">
            {isAdmin ? (
              <>
                <Shield className="w-6 h-6" />
                Order Management
              </>
            ) : (
              <>
                <Package className="w-6 h-6" />
                My Orders
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isAdmin
              ? "View and manage all customer orders"
              : "Track your recent purchases and order status"
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          {ordersList.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">
                No orders found
              </h3>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </TableHead>
                    {isAdmin && (
                      <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </TableHead>
                    )}
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {ordersList.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </TableCell>

                      {isAdmin && (
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-medium">{order.customerName || "N/A"}</span>
                            <span className="text-sm text-gray-500">{order.customerEmail || "N/A"}</span>
                          </div>
                        </TableCell>
                      )}

                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {order.created ? formatOrderDate(order.created.toISOString()) : "N/A"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="h-4 w-4 text-gray-500" />
                          <span>
                            {order.dispatchLocation ? getDispatchLabel(order.dispatchLocation) : "N/A"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatPrice(order.total)}
                      </TableCell>

                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            {
                              "bg-yellow-100 text-yellow-800": order.status === "pending",
                              "bg-blue-100 text-blue-800": order.status === "processing",
                              "bg-green-100 text-green-800": order.status === "succeeded",
                              "bg-purple-100 text-purple-800": order.status === "completed",
                              "bg-red-100 text-red-800": order.status === "cancelled",
                            }
                          )}
                        >
                          {friendlyStatus(order.status)}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <OrderRowDialog order={order} isAdmin={isAdmin} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}