'use client'

import { useState } from 'react'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import Filters from '@/components/Filters'
import { products } from '@/lib/products'
import { ChevronDown } from 'lucide-react'

export default function Home() {
  const [visibleProducts, setVisibleProducts] = useState(9)
  const [sortBy, setSortBy] = useState('featured')

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 3, products.length))
  }

  return (
    <main>
      <section className="relative h-[500px] overflow-hidden px-4 lg:px-6 mt-1">
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src="/herobgimage.svg"
            alt="Concert crowd"
            fill
            className="object-cover"
            priority
          />

          <div className="relative h-full flex items-center justify-center">
            <div className="bg-[#FFFFFF60] backdrop-blur-sm rounded-2xl p-8 md:p-12 w-[700px] text-center">
              <h1 className="text-2xl md:text-4xl font-semibold mb-4">
                Official concert merchandise
              </h1>
              <p className="text-lg text-gray-text mb-6">
                Premium quality apparel from your favorite artists and tours
              </p>
              <button className="btn-primary px-3 py-1.5">
                Shop new arrivals
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 lg:px-6 py-12 mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Filters />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">All products</h2>
                <p className="text-sm text-gray-text">
                  Showing {visibleProducts} products out of {products.length}
                </p>
              </div>

              <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-2 py-0.5 shadow-sm">
                <span className="font-medium text-gray-900">Sort by:</span>
                <button className="flex items-center py-1 hover:border-brand-orange transition-colors">
                  <span className="font-medium">Featured</span>
                  <ChevronDown className="w-4 h-4 pl-1" />
                </button>
              </div>
            </div>

            <button className="lg:hidden w-full mb-6 btn-secondary">
              Filters
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.slice(0, visibleProducts).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {visibleProducts < products.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  className="btn-secondary border border-gray-300 py-2 px-3 rounded-lg"
                >
                  Load more products
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
