'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'
import { ShippingInfo, PaymentMethod } from '@/lib/types'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import PaymentForm from '@/components/PaymentForm'
import { Check } from 'lucide-react'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
)

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const subtotal = useCartStore((state) => state.getSubtotal())
  const shipping = 2.49
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    })
  }

  if (items.length === 0) {
    return (
      <div className="px-2 lg:px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-text mb-8">Add some products to checkout</p>
        <a href="/" className="btn-primary inline-block">
          Continue Shopping
        </a>
      </div>
    )
  }

  return (
    <main className="px-2 lg:px-6 py-8">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-12 lg:px-20">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
              <h2 className="text-md font-medium mb-6">Shipping information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    placeholder="John"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    placeholder="Smith"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    placeholder="youremail@example.com"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    placeholder="123 Main St"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    placeholder="Your city"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    State
                  </label>
                  <select
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select state</option>
                    <option value="NY">New York</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    placeholder="10001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-md font-medium">Payment method</h2>
              </div>

              <div className="space-y-3">
                <label className="block border-2 rounded-lg px-3 py-1.5 cursor-pointer transition-all border-gray-200 hover:border-gray-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={selectedPayment === 'card'}
                        onChange={(e) =>
                          setSelectedPayment(e.target.value as PaymentMethod)
                        }
                        className="w-4 h-4 accent-brand-orange focus:ring-brand-orange"
                      />
                      <span className="font-medium">Credit / Debit Card</span>
                    </div>
                    <div className="flex gap-2">
                      <Image
                        src="/americanexpress.svg"
                        alt="mnee-logo"
                        width={40}
                        height={8}
                      ></Image>
                      <Image
                        src="/Mastercard.svg"
                        alt="mnee-logo"
                        width={40}
                        height={8}
                      ></Image>
                      <Image
                        src="/visa.svg"
                        alt="mnee-logo"
                        width={40}
                        height={8}
                      ></Image>
                    </div>
                  </div>
                </label>

                <label className="block border-2 rounded-lg px-3 py-1 cursor-pointer transition-all border-gray-200 hover:border-gray-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="stablecoin"
                        checked={selectedPayment === 'stablecoin'}
                        onChange={(e) =>
                          setSelectedPayment(e.target.value as PaymentMethod)
                        }
                        className="w-4 h-4 accent-brand-orange focus:ring-brand-orange"
                      />
                      <span className="font-medium">Pay with Stablecoin</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold">
                      <Image
                        src="/mneePaylogo.svg"
                        alt="mnee-logo"
                        width={110}
                        height={10}
                      ></Image>
                    </div>
                  </div>
                </label>

                <label className="block border-2 rounded-lg p-2 cursor-pointer transition-all border-gray-200 hover:border-gray-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={selectedPayment === 'paypal'}
                        onChange={(e) =>
                          setSelectedPayment(e.target.value as PaymentMethod)
                        }
                        className="w-4 h-4 accent-brand-orange focus:ring-brand-orange"
                      />
                      <span className="font-medium">PayPal</span>
                    </div>
                    <Image
                      src="/PayPal.svg"
                      alt="mnee-logo"
                      width={80}
                      height={10}
                    ></Image>
                  </div>
                </label>

                <label className="block border-2 rounded-lg p-2 cursor-pointer transition-all border-gray-200 hover:border-gray-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="klarna"
                        checked={selectedPayment === 'klarna'}
                        onChange={(e) =>
                          setSelectedPayment(e.target.value as PaymentMethod)
                        }
                        className="w-4 h-4 accent-brand-orange focus:ring-brand-orange"
                      />
                      <span className="font-medium">Buy now, pay later</span>
                    </div>
                    <Image
                      src="/klanapay.svg"
                      alt="mnee-logo"
                      width={70}
                      height={10}
                    ></Image>
                  </div>
                </label>
              </div>

              {selectedPayment === 'card' && (
                <div className="mt-6">
                  <Elements
                    stripe={stripePromise}
                    options={{
                      mode: 'payment',
                      amount: Math.round(total * 100),
                      currency: 'usd',
                    }}
                  >
                    <PaymentForm shippingInfo={shippingInfo} total={total} />
                  </Elements>
                </div>
              )}

              {/* {selectedPayment !== 'card' && (
                <button className="btn-primary w-full mt-6">
                  Complete Payment
                </button>
              )} */}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
                <h2 className="text-md font-medium mb-6">Order summary</h2>

                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                  {items.map((item, index) => (
                    <div
                      key={`${item.product.id}-${item.size}-${index}`}
                      className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium mb-1 text-sm">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-[#737373]">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                        <p className="font-medium mt-1">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
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
                  <div className="border-t border-gray-200 pt-3 pb-6 flex justify-between">
                    <span className="font-normal text-lg">Total</span>
                    <span className="font-medium text-2xl text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 py-4 px-6 rounded-xl bg-white text-[#737373]">
                <div className="flex items-center gap-2 text-md">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>30-day money back guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-md">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>Free returns on all orders</span>
                </div>
              </div>

              <div>
                <Image
                  src="/paywithstripe.svg"
                  alt="stripe-logo"
                  height={10}
                  width={130}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
