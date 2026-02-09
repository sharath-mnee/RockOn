'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Star } from 'lucide-react'
import { categories } from '@/lib/products'

export default function Filters() {
  const [priceOpen, setPriceOpen] = useState(false)
  const [ratingOpen, setRatingOpen] = useState(false)

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  return (
    <div className="bg-white rounded-lg border p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg">Filters</h2>
        <button className="text-brand-orange text-sm font-medium">
          Clear all
        </button>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.name}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded"
                  defaultChecked={category.name === 'All products'}
                />
                <span className="text-sm">{category.name}</span>
              </div>
              {category.name === 'All products' ? (
                <span className="bg-brand-orange text-white text-xs px-2 py-1 rounded">
                  {category.count}
                </span>
              ) : (
                <span className="text-gray-text text-xs">{category.count}</span>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              className="border border-gray-border rounded-lg py-2 text-sm font-medium hover:border-brand-orange hover:bg-brand-orange hover:text-white transition-colors"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold">Price range</h3>
          {priceOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {priceOpen && (
          <div className="space-y-2">
            {['Under $25', '$25 - $50', '$50 - $75', 'Over $75'].map(
              (range) => (
                <label
                  key={range}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input type="radio" name="price" className="rounded-full" />
                  <span className="text-sm">{range}</span>
                </label>
              ),
            )}
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => setRatingOpen(!ratingOpen)}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold">Rating</h3>
          {ratingOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {ratingOpen && (
          <div className="space-y-2">
            {[5, 4, 3].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input type="checkbox" className="rounded" />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm ml-1">& up</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
