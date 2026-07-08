"use client"

import { Session } from "next-auth"
import { Logout } from "@/lib/actions/authgoogle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { LogOut, Settings, TruckIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export const UserButton = ({ user }: Session) => {
  const router = useRouter()

  if (!user) return null

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <div className="relative w-9 h-9 border border-current overflow-hidden flex items-center justify-center">
          {user.image ? (
            <Image src={user.image} alt={user.name ?? "User"} fill className="object-cover" />
          ) : (
            <span className="font-black text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-0 bg-white border border-black/10" align="end">
        {/* Profile header */}
        <div className="flex flex-col items-center gap-3 p-6 border-b border-black/10">
          <div className="relative w-16 h-16 border border-black/10 overflow-hidden">
            {user.image ? (
              <Image src={user.image} alt={user.name ?? "User"} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black/5">
                <span className="font-black text-xl text-black">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-black font-black uppercase tracking-tight text-sm">
              {user.name}
            </p>
            <p className="text-black/40 font-semibold" style={{ fontSize: "0.7rem" }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Menu items */}
        <div className="p-2">
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/orders")}
            className="group flex items-center gap-3 px-3 py-3 font-bold uppercase tracking-[0.15em] cursor-pointer text-black hover:bg-black hover:text-white transition-colors duration-200"
            style={{ fontSize: "0.65rem" }}
          >
            <TruckIcon
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
            My Orders
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className="group flex items-center gap-3 px-3 py-3 font-bold uppercase tracking-[0.15em] cursor-pointer text-black hover:bg-black hover:text-white transition-colors duration-200"
            style={{ fontSize: "0.65rem" }}
          >
            <Settings
              size={14}
              className="group-hover:rotate-180 transition-transform duration-300"
            />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-black/10 my-1" />

          <DropdownMenuItem
            onClick={() => Logout()}
            className="group flex items-center gap-3 px-3 py-3 font-bold uppercase tracking-[0.15em] cursor-pointer text-black hover:bg-black hover:text-white transition-colors duration-200"
            style={{ fontSize: "0.65rem" }}
          >
            <LogOut
              size={14}
              className="group-hover:scale-75 transition-transform duration-300"
            />
            Sign Out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}