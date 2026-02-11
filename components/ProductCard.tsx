'use client'

import Image from 'next/image'
import { Product } from '@/lib/types'
import { useCartStore } from '@/lib/store'
import { ShoppingCart, Star } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    const defaultSize =
      product.sizes.length > 0 ? product.sizes[2] || product.sizes[0] : 'M'
    addItem(product, defaultSize)
    toast.success('Added to cart!')
  }

  return (
    <div className="product-card border border-gray-300 rounded-xl">
      <div className="relative h-[420px] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <span
            className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-semibold ${
              product.badge === 'Best seller'
                ? 'bg-brand-orange text-white'
                : 'bg-green-600 text-white'
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-[#737373] mb-1">{product.category}</p>

        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-text">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-4 py-2 border border-gray-border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">1-click buy</span>
          </button>
        </div>
      </div>
    </div>
  )
}
