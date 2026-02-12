import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// const metaData = {
//     customer_name: 'John Smith',
//     customer_email: 'john.smith@example.com',
//     customer_address: '123 Main St New York, NY 10001 United States'
//     product_name: 'Festival Vibes sticker pack',
// }

const stripeKey = process.env.STRIPE_SECRET_KEY

if (!stripeKey) {
  throw new Error('Missing Stripe secret key (STRIPE_SECRET_KEY)')
}
const stripe = new Stripe(stripeKey, {
  apiVersion: '2026-01-28.clover',
})

export async function POST(request: NextRequest) {
  try {
    const { cpm_id, hash, amount, metadata } = await request.json()
    const amountInCents = Math.round(amount * 100)

    // payment method
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'custom',
      custom: {
        type: cpm_id,
      },
    })

    // create customer
    const customer = await stripe.customers.create({
      name: metadata.customer_name,
      email: metadata.customer_email,
    })

    // record custom payment
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
      description: `Custom payment for product ${metadata?.product_name} $${amount} from ${metadata?.customer_name || 'unknown customer'}`,
      customer_details: {
        customer: customer.id || 'Unknown Customer',
      },
      shipping_details: {
        address: {
          line1: metadata?.customer_address || 'Unknown Address',
        },
        name: metadata?.customer_name || 'Unknown Customer',
      },
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
