"use client"

import { useTransition } from "react"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { updateOrderStatus } from "@/lib/actions/update-order-status"

export function OrderActions({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleComplete = () => {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, "succeeded")
        toast.success("Order marked complete — customer notified")
      } catch (err) {
        toast.error("Failed to update order")
        console.error(err)
      }
    })
  }

  const handleCancel = () => {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, "cancelled")
        toast.success("Order cancelled")
      } catch (err) {
        toast.error("Failed to cancel order")
        console.error(err)
      }
    })
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        size="sm"
        disabled={isPending}
        onClick={handleComplete}
        className="bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        {isPending ? "Processing..." : "Mark Complete"}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        disabled={isPending}
        onClick={handleCancel}
      >
        <X className="mr-2 h-4 w-4" />
        Cancel
      </Button>
    </div>
  )
}