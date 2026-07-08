// components/footer.tsx
import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-black/10 py-10 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-black font-black text-sm tracking-[0.2em] uppercase">
              NSA
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {['Home', 'Shop', 'Jerseys', 'Accessories'].map((item, i) => (
              <React.Fragment key={item}>
                <Link
                  href={i === 0 ? '/' : '/products'}
                  className="text-black/40 hover:text-black transition-colors uppercase"
                  style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em' }}
                >
                  {item}
                </Link>
                {i < 3 && <span className="text-black/15 hidden md:inline">·</span>}
              </React.Fragment>
            ))}
          </nav>

          {/* Legal + copyright */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-black/40 hover:text-black transition-colors"
              style={{ fontSize: '0.65rem', letterSpacing: '0.3em', fontWeight: 600, textTransform: 'uppercase' }}
            >
              Privacy
            </Link>
            <Link
              href="/"
              className="text-black/40 hover:text-black transition-colors"
              style={{ fontSize: '0.65rem', letterSpacing: '0.3em', fontWeight: 600, textTransform: 'uppercase' }}
            >
              Terms
            </Link>
            <span
              className="text-black/30"
              style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 500, textTransform: 'uppercase' }}
            >
              © {new Date().getFullYear()} NSA
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}