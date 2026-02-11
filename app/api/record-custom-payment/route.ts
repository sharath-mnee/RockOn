import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// const metaData = {
//     customer_name: 'John Smith',
//     customer_email: 'john.smith@example.com',
//     customer_address: '123 Main St New York, NY 10001 United States'
// }

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY

if (!stripeKey) {
  throw new Error('Missing Stripe secret key (NEXT_PUBLIC_STRIPE_SECRET_KEY)')
}
const stripe = new Stripe(stripeKey, {
  apiVersion: '2026-01-28.clover',
})

export async function POST(request: NextRequest) {
  try {
    const { cpm_id, hash, amount, metadata } = await request.json()
    const amountInCents = Math.round(amount * 100)
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'custom',
      custom: {
        type: cpm_id,
      },
    })

    const paymentRecord = await stripe.paymentRecords.reportPayment({
      amount_requested: {
        value: amountInCents,
        currency: 'usd',
      },
      payment_method_details: {
        payment_method: paymentMethod.id,
      },
      processor_details: {
        type: 'custom',
        custom: {
          payment_reference: hash,
        },
      },
      initiated_at: Math.floor(Date.now() / 1000),
      customer_presence: 'on_session',
      outcome: 'guaranteed',
      guaranteed: {
        guaranteed_at: Math.floor(Date.now() / 1000),
      },
      metadata: metadata,
    })

    return NextResponse.json({
      paymentRecord: paymentRecord,
    })
  } catch (error: any) {
    console.error('Payment Intent Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 },
    )
  }
}
