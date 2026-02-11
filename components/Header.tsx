'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { ShoppingCart, Search, Menu, X, Copy } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { useHydrated } from '@/lib/useHydrated'

export default function Header() {
  const hydrated = useHydrated()
  const totalItems = useCartStore((state) => state.getTotalItems())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  if (!hydrated) return null

  return (
    <>
      {/* Promo*/}
      <div className="w-full bg-gradient-to-r from-brand-peach-light to-brand-peach text-black">
        <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-4 h-14 px-4">
          <span className="text-sm font-medium">
            Refer a friend, get 25% OFF
          </span>

          <div className="flex items-center gap-2 bg-[#F8BDB2] rounded-full px-3 py-1.5">
            <span className="bg-white rounded-lg py-0.5 px-3 text-xs font-semibold">
              Code
            </span>
            <span className="font-medium text-sm">FRDM126</span>
            <button className="hover:opacity-70 bg-white p-1 rounded-md">
              <Copy className="h-3 w-3 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white sticky top-0 z-50 w-full">
        <div className="flex items-center h-16 px-2 lg:px-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="text-2xl font-bold text-brand-orange">
              <Image
                src="/Rockonlogo.svg"
                alt="logo"
                width={120}
                height={40}
              ></Image>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-brand-orange transition-colors">
                Shop
              </Link>
              <Link
                href="/"
                className="hover:text-brand-orange transition-colors"
              >
                Artists
              </Link>
              <Link
                href="/"
                className="hover:text-brand-orange transition-colors"
              >
                New Arrivals
              </Link>
              <Link
                href="/"
                className="hover:text-brand-orange transition-colors"
              >
                Collections
              </Link>
            </nav>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-gray-bg rounded-lg px-4 py-1 w-80 border border-gray-300">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm w-full text-gray-600"
              />
            </div>

            <Link
              href="/checkout"
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-0.5 rounded-lg hover:bg-white transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white text-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                ({totalItems > 0 ? totalItems : 0})
              </span>
            </Link>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t px-4">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-brand-orange transition-colors">
                Shop
              </Link>
              <Link
                href="/"
                className="hover:text-brand-orange transition-colors"
              >
                Artists
              </Link>
              <Link
                href="/"
                className="hover:text-brand-orange transition-colors"
              >
                New Arrivals
              </Link>
              <Link
                href="/"
                className="hover:text-brand-orange transition-colors"
              >
                Collections
              </Link>
              <div className="flex items-center bg-gray-bg rounded-lg px-4 py-1 w-full border border-gray-300">
                <Search className="w-4 h-4 text-gray-text mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent outline-none text-sm w-full text-gray-600"
                />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
