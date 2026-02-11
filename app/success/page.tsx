import dynamic from 'next/dynamic'

const SuccessPageClient = dynamic(() => import('./SuccessPageClient'), {
  ssr: false,
})

export default function Page() {
  return <SuccessPageClient />
}
