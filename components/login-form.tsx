"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Login } from "@/lib/actions/authgoogle"
import { ArrowLeft, Truck, RotateCcw, Tag, Package } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col min-h-screen bg-black",
        className
      )}
      {...props}
    >
      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full md:my-10 md:border md:border-white/10">

        {/* LEFT — Form side (black) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-14 py-16 md:py-0 relative">

          {/* Faded wordmark background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span
              className="text-white font-black uppercase"
              style={{
                fontSize: "clamp(5rem, 16vw, 12rem)",
                lineHeight: 0.82,
                letterSpacing: "-0.05em",
                opacity: 0.04,
              }}
            >
              NSA
            </span>
          </div>

          <div className="relative z-10 max-w-sm mx-auto w-full">

            {/* Back link */}
            <Link
              href="/"
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-200 uppercase font-bold tracking-[0.2em] text-[0.6rem] mb-10 w-fit"
            >
              <ArrowLeft size={12} />
              Back to Home
            </Link>

            {/* Logo / brand */}
            <div className="mb-10">
              <p className="text-white/40 font-semibold uppercase mb-3 tracking-[0.45em] text-xs">
                Welcome to
              </p>
              <h1 className="text-white font-black uppercase text-5xl tracking-tight leading-none">
                NSA
              </h1>
            </div>

            <p className="text-white/60 leading-relaxed mb-10" style={{ fontSize: "0.85rem" }}>
              Sign in to access your dashboard, track orders, and shop the
              latest drops before anyone else.
            </p>

            {/* Google sign in */}
            <button
              type="button"
              onClick={() => Login()}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-black uppercase tracking-[0.2em] py-4 text-[0.7rem] hover:bg-white/90 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </button>

            {/* Benefits */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <p
                className="text-white/40 font-bold uppercase tracking-[0.3em] mb-5"
                style={{ fontSize: "0.6rem" }}
              >
                Member Benefits
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Package size={14} className="text-white/40 shrink-0" />
                  <span className="text-white/70 text-sm">Order tracking & history</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck size={14} className="text-white/40 shrink-0" />
                  <span className="text-white/70 text-sm">Express checkout experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <Tag size={14} className="text-white/40 shrink-0" />
                  <span className="text-white/70 text-sm">Early access to new drops</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={14} className="text-white/40 shrink-0" />
                  <span className="text-white/70 text-sm">Easy reordering</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <p className="text-white/30 mt-10" style={{ fontSize: "0.65rem" }}>
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-white/60 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-white/60 transition-colors">
                Privacy Policy
              </a>.
            </p>
          </div>
        </div>

        {/* RIGHT — Image side */}
        <div className="hidden md:block w-1/2 relative overflow-hidden">
          <Image
            src="/net-jersey.jpg"
            alt="Elite athlete in motion, dark dramatic studio lighting"
            fill
            priority
            className="object-cover object-center"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

          <div className="absolute bottom-10 left-10 right-10 z-10">
            <p className="text-white/50 text-[0.5rem] tracking-[0.4em] uppercase font-semibold mb-2">
              SS26 Collection
            </p>
            <h2 className="text-white font-black uppercase text-3xl tracking-tight leading-none mb-3">
              Play at the
              <br />
              Highest Level
            </h2>
            <p className="text-white/60 text-sm">
              Premium sports jerseys and accessories for those who demand more.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}