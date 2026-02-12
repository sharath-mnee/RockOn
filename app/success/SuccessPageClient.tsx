'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { CircleCheck, Check, Box, Mail } from 'lucide-react'

export default function SuccessPageClient() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const subtotal = useCartStore((state) => state.getSubtotal())
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 900000) + 100000
    setOrderNumber(`RO-${year}-${random}`)
  }, [])

  const shipping = 2.49
  const tax = subtotal * 0.1
  // const total = subtotal + shipping + tax
  const total = subtotal

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#2ECC7826] rounded-full mb-4">
            <CircleCheck className="w-12 h-12 text-[#2ECC78]" />
          </div>
          <h1 className="text-lg font-regular mb-2 text-gray-800">
            Order confirmed!
          </h1>
          <p className="text-[#737373] mt-4">
            Thank you for your purchase. Your order has been successfully
            processed.
          </p>
          <p className="mt-4 text-[#737373] text-sm">
            Order number:{' '}
            <span className="text-brand-orange font-medium">{orderNumber}</span>
          </p>
        </div>

        <div className="bg-white border border-gray-border rounded-xl p-6 mb-6">
          <h2 className="text-md font-medium mb-4">Order summary</h2>

          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div
                key={`${item.product.id}-${item.size}-${index}`}
                className="flex gap-4"
              >
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-regular mb-1">{item.product.name}</h3>
                  <p className="text-sm text-[#737373]">
                    Size: {item.size} • Qty: {item.quantity}
                  </p>
                  <p className="font-regular mt-1">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm text-[#737373]">
              <span>Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#737373]">
              <span>Shipping & Tax (10%)</span>
              <span className="font-medium">
                ${(shipping + tax).toFixed(2)}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-regular text-md">Total</span>
              <span className="font-regular text-2xl">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-3 pt-2">
            <div className="flex items-center gap-3 bg-green-50 rounded-md p-3">
              <div className="rounded-xl bg-green-100 p-2.5">
                <Check className="w-5 h-5 text-gray-800 flex-shrink-0" />
              </div>

              <span className="text-sm">Successfully paid with stablecoin</span>
              <div className="ml-auto flex items-center gap-1 font-bold text-sm">
                <Image
                  src="/mneePaylogo.svg"
                  alt="mnee-logo"
                  width={110}
                  height={10}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-border rounded-xl p-6 mb-6">
          <h2 className="text-md font-medium mb-4">Shipping information</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Box className="w-5 h-5 text-gray-700 mt-0.5" />
              <div>
                <p className="text-sm text-[#737373]">Estimated delivery</p>
                <p className="font-regular text-sm mt-0.5">March 1, 2026</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-700 mt-0.5" />
              <div>
                <p className="text-sm text-[#737373]">Confirmation email</p>
                <p className="font-regular text-sm mt-0.5">
                  john.smith@example.com
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-regular mb-3">Shipping Address</h3>
            <div className="text-[#737373] text-sm">
              <p>John Smith</p>
              <p>123 Main St</p>
              <p>New York, NY 10001</p>
              <p>United States</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            onClick={() => clearCart()}
            href="/"
            className="btn-primary w-full block text-center p-2"
          >
            Back to store
          </Link>
          <button className="btn-secondary w-full p-2 border border-gray-300 shadow-sm rounded-lg">
            Download receipt
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-[#737373] text-sm mb-2">
            Need help with your order?
          </p>
          <Link href="/" className="text-gray-800 font-medium text-sm">
            Contact support
          </Link>
        </div>
      </div>
    </main>
  )
}
