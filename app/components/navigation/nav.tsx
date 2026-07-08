'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import CartDrawer from '../cart/cart-drawer'
import { UserButton } from './user-button'
import { Session } from 'next-auth'

interface NavProps {
  session: Session | null
}

export default function Nav({ session }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Text/icon color flips: white over transparent (dark hero), black once scrolled onto white bg
  const textColor = scrolled ? 'text-black' : 'text-white'

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-black/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between relative">

          {/* Left nav */}
          <nav className="hidden md:flex items-center gap-10">
            <Link href="/" className={`nav-link-nsa transition-colors duration-300 ${textColor}`}>Home</Link>
            <Link href="/products" className={`nav-link-nsa transition-colors duration-300 ${textColor}`}>Shop</Link>
          </nav>

          {/* Logo center */}
          <Link href="/" className="flex items-center gap-2.5 absolute left-1/2 -translate-x-1/2">
            <span className={`font-black text-xl tracking-[0.15em] uppercase transition-colors duration-300 ${textColor}`}>
              NSA
            </span>
          </Link>

          {/* Right nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className={`nav-link-nsa transition-colors duration-300 ${textColor}`}>Jerseys</Link>

            {session && (
              <div className={`relative flex items-center transition-colors duration-300 ${textColor}`}>
                <CartDrawer />
              </div>
            )}

            {!session ? (
              <Link href="/login" className="btn-primary py-2.5 px-6 text-[0.6rem] flex items-center gap-2">
                <LogIn size={12} />
                Sign In
              </Link>
            ) : (
              <div className={`transition-colors duration-300 ${textColor}`}>
                <UserButton expires={session?.expires ?? ''} user={session?.user} />
              </div>
            )}
          </nav>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center gap-4 ml-auto">
            {session && (
              <div className={`relative flex items-center transition-colors duration-300 ${textColor}`}>
                <CartDrawer />
              </div>
            )}
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className={`block w-6 h-[1.5px] transition-all duration-300 ${scrolled ? 'bg-black' : 'bg-white'} ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-6 h-[1.5px] transition-all duration-300 ${scrolled ? 'bg-black' : 'bg-white'} ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-[1.5px] transition-all duration-300 ${scrolled ? 'bg-black' : 'bg-white'} ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu — always white bg, black text (it's a full modal) */}
      <div
        className={`fixed inset-0 z-[99] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center gap-10 transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {[
          { label: 'Home', href: '/' },
          { label: 'Shop All', href: '/products' },
          { label: 'Jerseys', href: '/products' },
          { label: 'Accessories', href: '/products' },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="text-black font-black text-4xl tracking-tight uppercase hover:opacity-50 transition-opacity"
          >
            {item.label}
          </Link>
        ))}

        {!session ? (
          <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-primary mt-4 flex items-center gap-2">
            <LogIn size={14} />
            Sign In
          </Link>
        ) : (
          <div className="mt-4" onClick={() => setMenuOpen(false)}>
            <UserButton expires={session?.expires ?? ''} user={session?.user} />
          </div>
        )}
      </div>
    </>
  )
}