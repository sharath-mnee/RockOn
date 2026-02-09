'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { ShippingInfo } from '@/lib/types'
import toast from 'react-hot-toast'

interface PaymentFormProps {
  shippingInfo: ShippingInfo
  total: number
}

export default function PaymentForm({ shippingInfo, total }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    // Validate shipping info
    if (
      !shippingInfo.firstName ||
      !shippingInfo.email ||
      !shippingInfo.address
    ) {
      toast.error('Please fill in all shipping information')
      return
    }

    setLoading(true)

    try {
      // Submit the form to validate
      const { error: submitError } = await elements.submit()

      if (submitError) {
        toast.error(submitError.message || 'Payment validation failed')
        setLoading(false)
        return
      }

      // Create Payment Intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: 'usd',
        }),
      })

      const { clientSecret, error } = await response.json()

      if (error) {
        toast.error(error)
        setLoading(false)
        return
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      })

      if (confirmError) {
        toast.error(confirmError.message || 'Payment failed')
      }
    } catch (err) {
      toast.error('Payment failed. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Complete Payment'}
      </button>
    </form>
  )
}
