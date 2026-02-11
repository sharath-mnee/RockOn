'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ShieldCheck, X } from 'lucide-react'
import { buildEip681Erc20Transfer } from '@/lib/eip681'
import type { PaymentStage, StripeData } from '@/lib/types'

interface StablecoinPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  integrationId: string
  paymentIntentId: string
  customerName: string
  customerEmail: string
  customerAddress: string
  onSuccess?: (
    transactionHash: string,
    customerAddress: string,
    customerEmail: string,
    customerName: string,
    amount: number,
  ) => void
}

const BASE_USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function StablecoinPaymentModal({
  isOpen,
  onClose,
  amount,
  integrationId,
  paymentIntentId,
  customerName,
  customerEmail,
  customerAddress,
  onSuccess,
}: StablecoinPaymentModalProps) {
  const [stage, setStage] = useState<PaymentStage>('LOADING')
  const [paymentData, setPaymentData] = useState<StripeData | null>(null)
  const [transactionHash, setTransactionHash] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [secondsLeft, setSecondsLeft] = useState(10)
  const pollIntervalRef = useRef<number | null>(null)
  const hasCalledOnSuccess = useRef(false)

  // poll
  const startTransactionPolling = useCallback((sessionToken: string) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }

    const poll = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/integrations/public/stripe/sessions/status`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error('Failed to check payment status')
        }

        const data = await response.json()

        if (data.status === 'PROCESSING') {
          setTransactionHash(data.transaction?.paymentTxHash || '')
          setStage('PROCESSING')
        }

        if (data.status === 'COMPLETED') {
          setTransactionHash(data.transaction?.paymentTxHash || '')
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
          }
          setStage('COMPLETED')
        }

        if (data.status === 'FAILED') {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
          }
          setError('Payment failed. Please try again.')
          setStage('FAILED')
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }

    // Start polling
    setTimeout(() => {
      poll()
      pollIntervalRef.current = window.setInterval(poll, 2500)
    }, 2500)
  }, [])

  // payment session
  const createPayment = useCallback(
    async (
      amt: string,
      integration: string,
      paymentIntent: string,
      name: string,
      email: string,
      address: string,
    ) => {
      try {
        const payload = {
          amountUsdCents: Math.round(Number(amt) * 100),
          integrationId: integration,
          paymentIntentId: paymentIntent,
          userMetaData: { name, email, address },
          chain: 'BASE',
          stablecoin: 'USDC',
        }

        const response = await fetch(
          `${API_BASE_URL}/integrations/public/stripe/session`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          },
        )

        if (!response.ok) {
          throw new Error('Failed to create payment')
        }

        const data: StripeData = await response.json()

        setPaymentData(data)
        setStage(data?.status ?? 'PENDING')

        if (data?.sessionToken) {
          startTransactionPolling(data.sessionToken)
        }
      } catch (err) {
        setError('Failed to process payment. Please try again.')
        setStage('FAILED')
        console.error('Payment error:', err)
      }
    },
    [startTransactionPolling],
  )

  // Qr code
  const qrValue = useMemo(() => {
    const depositAddress = paymentData?.depositAddress ?? ''
    const amountUsdc = String(amount)

    return depositAddress && depositAddress.startsWith('0x')
      ? buildEip681Erc20Transfer({
          tokenContract: BASE_USDC_CONTRACT,
          recipient: depositAddress,
          amount: amountUsdc,
        })
      : ''
  }, [amount, paymentData?.depositAddress])

  // initialize payment
  useEffect(() => {
    if (isOpen) {
      setStage('LOADING')
      setError('')
      setTransactionHash('')
      createPayment(
        String(amount),
        integrationId,
        paymentIntentId,
        customerName,
        customerEmail,
        customerAddress,
      )
    }

    // Cleanup
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [
    isOpen,
    amount,
    integrationId,
    paymentIntentId,
    customerName,
    customerEmail,
    customerAddress,
    createPayment,
  ])

  // Handle success callback
  useEffect(() => {
    if (
      stage === 'COMPLETED' &&
      onSuccess &&
      transactionHash &&
      amount &&
      customerAddress &&
      customerEmail &&
      customerName &&
      !hasCalledOnSuccess.current
    ) {
      hasCalledOnSuccess.current = true
      queueMicrotask(() => {
        onSuccess(
          transactionHash,
          customerAddress,
          customerEmail,
          customerName,
          amount,
        )
      })
    }
  }, [
    stage,
    transactionHash,
    onSuccess,
    amount,
    customerAddress,
    customerEmail,
    customerName,
  ])

  useEffect(() => {
    if (isOpen) {
      hasCalledOnSuccess.current = false
    }
  }, [isOpen])

  useEffect(() => {
    if (stage !== 'COMPLETED') return

    setSecondsLeft(5)

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [stage, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00000099]">
      {stage === 'LOADING' && (
        <div className="bg-[#F7F7F7] border border-white rounded-3xl p-16 text-center max-w-xs w-full shadow-2xl">
          <div className="w-12 h-12 border-4 border-[#E88C1F]/30 border-t-[#E88C1F] rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-[#E88C1F] text-sm font-medium">
            Initializing payment...
          </p>
        </div>
      )}

      {/* QR Code Modal */}
      {stage === 'PENDING' && paymentData && (
        <div className="bg-[#F7F7F7] border border-white rounded-3xl py-4 px-6 w-[400px] shadow-2xl h-[695px] flex flex-col">
          <div className="mb-4 flex items-center justify-between -ml-3">
            <img
              src="/mneePaylogo.svg"
              alt="mnee-logo"
              className="w-32 h-auto object-contain"
            />
            <button
              onClick={onClose}
              className="text-[#525252] hover:text-[#525252] transition-colors ml-3"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-4">
            <h2 className="font-md text-[#525252] mb-1.5">
              Pay with Stablecoin
            </h2>

            <div className="text-center">
              <p className="text-[#525252] font-md text-[13px] pb-1">
                RockOn store
              </p>
              <div className="text-4xl font-bold text-gray-800 tracking-tight">
                ${Number(amount).toFixed(2)}
              </div>
              <div className="text-[12px] text-[#525252] font-sm pt-1">
                {Number(amount).toFixed(2)} USDC
              </div>
            </div>

            <div className="w-[230px] mt-2.5 flex items-center gap-2 bg-[#F0F0F0] border border-whitw rounded-full p-2">
              <img
                src="/DigitalAsset.svg"
                alt="Base_Logo"
                className="w-8 h-8 pl-0.5"
              />
              <div className="flex-1 text-left">
                <div className="text-gray-800 text-[13px] font-semibold">
                  USD Coin{' '}
                  <span className="text-[#525252] font-normal">
                    (USDC on Base)
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-2 mt-1.5 flex flex-col items-center w-[230px] pt-6">
              <QRCodeSVG
                value={qrValue}
                size={175}
                level="H"
                imageSettings={{
                  src: '/DigitalAsset.svg',
                  x: undefined,
                  y: undefined,
                  height: 30,
                  width: 30,
                  excavate: true,
                }}
              />
              <p className="text-[#525252] text-[10px] font-semibold tracking-wider text-center mt-3 mb-1 uppercase">
                Scan with your wallet app
              </p>
            </div>

            <div className="w-full">
              <p className="text-[#525252] text-[12px] text-center mb-2">
                Or send manually to:
              </p>
              <div className="flex items-center gap-1 bg-[#F0F0F0] border border-white rounded-xl p-2">
                <code className="flex-1 text-[#525252] text-xxs font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {paymentData.depositAddress}
                </code>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      paymentData.depositAddress ?? '',
                    )
                  }
                  className="text-[#525252] bg-white rounded-lg hover:text-[#525252] transition-colors flex-shrink-0 p-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-2 inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#0084341A] border border-[#00843433] rounded-full">
              <ShieldCheck className="text-[#008434] h-3 w-3" />
              <span className="text-[#008434] text-[10px] font-semibold">
                Secure
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Processing Modal */}
      {stage === 'PROCESSING' && (
        <div className="bg-[#F7F7F7] border border-[#F7F7F7] rounded-3xl p-10 max-w-md w-full shadow-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative w-16 h-16">
              <svg className="absolute inset-0" viewBox="0 0 50 50">
                <circle
                  cx="25"
                  cy="25"
                  r="23"
                  fill="none"
                  stroke="#E88C1F4D"
                  strokeWidth="0.5"
                />
              </svg>

              <svg className="absolute inset-2" viewBox="0 0 50 50">
                <circle
                  cx="25"
                  cy="25"
                  r="18"
                  fill="none"
                  stroke="#E88C1F"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="85 45"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 25 25"
                    to="360 25 25"
                    dur="1.25s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Payment processing
          </h2>
          <p className="text-[#525252] text-md mb-8">
            Confirming on Base network...
          </p>

          <div className="mx-auto w-[280px] bg-[#F0F0F0] border border-white rounded-xl px-3 py-2.5 mb-6">
            <div className="flex justify-between items-center py-1">
              <span className="text-[#525252] text-xs">Amount</span>
              <span className="text-gray-800 text-xs font-medium">
                {amount} USDC
              </span>
            </div>

            {transactionHash && (
              <div className="flex justify-between items-center py-1">
                <span className="text-[#525252] text-xs">Transaction hash</span>

                <a
                  href={`https://basescan.org/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E88C1F] text-xs font-mono hover:text-orange-400 flex items-center gap-1"
                >
                  {transactionHash.slice(0, 6)}…{transactionHash.slice(-4)}
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>

          <p className="text-[#525252] text-xs">
            Please wait, this usually takes less than a minute
          </p>
        </div>
      )}

      {/* Success Modal */}
      {stage === 'COMPLETED' && (
        <div className="bg-[#F7F7F7] border border-[#F7F7F7] rounded-3xl p-10 w-[420px] shadow-2xl text-center">
          <div className="mb-6">
            <div className="w-14 h-14 bg-[#00C9501A] rounded-full flex border border-[#00C95080] items-center justify-center mx-auto shadow-sm">
              <svg
                className="w-7 h-7 text-[#00C950]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Payment Successful
          </h2>
          <p className="text-[#525252] text-lg mb-6">
            ${amount} paid with USDC
          </p>

          <div className="mx-auto w-[280px] bg-[#F0F0F0] border border-white rounded-xl px-3 py-2.5 mb-6">
            <div className="flex justify-between items-center py-1">
              <span className="text-[#525252] text-xs">Time</span>
              <span className="text-gray-800 text-xs font-medium">
                {new Date().toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#525252] text-xs">Transaction hash</span>

              <a
                href={`https://basescan.org/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E88C1F] text-xs font-mono hover:text-orange-400 flex items-center gap-1"
              >
                {transactionHash.slice(0, 6)}…{transactionHash.slice(-4)}
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onClose}
              className="w-[250px] bg-[#E88C1F] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
            >
              Close
            </button>
          </div>

          <p className="text-[#525252] text-xs mt-5">
            Auto-closing in {secondsLeft}s…
          </p>
        </div>
      )}

      {/* Failed Modal */}
      {stage === 'FAILED' && (
        <div className="relative bg-[#F7F7F7] border border-[#F7F7F7] rounded-3xl p-10 max-w-md w-full shadow-2xl text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#525252] hover:text-gray-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Payment Failed
          </h2>
          <p className="text-[#525252] text-sm mb-8">{error}</p>
          <button
            onClick={() => {
              setStage('LOADING')
              createPayment(
                String(amount),
                integrationId,
                paymentIntentId,
                customerName,
                customerEmail,
                customerAddress,
              )
            }}
            className="w-[200px] bg-[#E93101] hover:bg-[#E93101] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/30"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
