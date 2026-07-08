import { auth } from "@/server/auth"
import { BarChart, Package, PenSquare, Settings, Truck } from "lucide-react"

import DashboardNav from "@/app/components/navigation/dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  const userLinks = [
    {
      label: "Orders",
      path: "/dashboard/orders",
      icon: <Truck size={16} />,
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={16} />,
    },
  ] as const

  const adminLinks =
    session?.user.role === "admin"
      ? [
          {
            label: "Analytics",
            path: "/dashboard/analytics",
            icon: <BarChart size={16} />,
          },
          {
            label: "Create",
            path: "/dashboard/add-product",
            icon: <PenSquare size={16} />,
          },
          {
            label: "Products",
            path: "/dashboard/products",
            icon: <Package size={16} />,
          },
        ]
      : []

  const allLinks = [...adminLinks, ...userLinks]

  return (
    // pt-28 clears the fixed main Nav (which sits at z-[100] over the whole site)
    // so DashboardNav and page content never sit underneath it and become unclickable
    <div className="pt-28 min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
        <DashboardNav allLinks={allLinks} />
        {children}
      </div>
    </div>
  )
}