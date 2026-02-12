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
        <h2 className="font-sm text-md">Filters</h2>
        <button className="text-brand-orange text-sm font-medium">
          Clear all
        </button>
      </div>

      <div className="mb-6">
        <h3 className="font-sm mb-4">Categories</h3>

        <div className="flex">
          <div className="mr-3 ml-1 flex">
            <div className="w-px bg-gray-300 h-full"></div>
          </div>

          <div className="space-y-3">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className={`px-3 py-1 rounded-md flex justify-between items-center min-w-[200px] 
                  ${
                    index === 0
                      ? 'bg-brand-orange text-white'
                      : 'bg-white text-[#737373]'
                  }`}
              >
                <span className="text-sm">{category.name}</span>

                <span className="text-xs px-2 py-1">{category.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-sm mb-3">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              className="border text-[#737373] border-gray-border rounded-lg py-1.5 text-sm font-medium hover:border-brand-orange hover:bg-brand-orange hover:text-white transition-colors"
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
          <h3 className="font-sm">Price range</h3>
          {priceOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {priceOpen && (
          <div className="relative pl-4">
            <div className="absolute left-1 top-0 bottom-0 w-px bg-gray-300" />

            <div className="space-y-2">
              {['Under $25', '$25 - $50', '$50 - $75', 'Over $75'].map(
                (range) => (
                  <label
                    key={range}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded"
                  >
                    <span className="text-sm text-[#737373]">{range}</span>
                  </label>
                ),
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => setRatingOpen(!ratingOpen)}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-sm">Rating</h3>
          {ratingOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {ratingOpen && (
          <div className="relative pl-4">
            <div className="absolute left-1 top-0 bottom-0 w-px bg-gray-300" />

            <div className="space-y-2">
              {[5, 4, 3].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded"
                >
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
          </div>
        )}
      </div>
    </div>
  )
}
