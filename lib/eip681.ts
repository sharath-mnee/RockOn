export const BASE_CHAIN_ID = 8453

export function toBaseUnits(amount: string | number, decimals: number): string {
  // Safe string-based conversion without floating issues
  const s = String(amount).trim()
  if (!s) throw new Error('amount is empty')

  const [whole, frac = ''] = s.split('.')
  if (!/^\d+$/.test(whole || '0')) throw new Error('invalid whole amount')
  if (frac && !/^\d+$/.test(frac)) throw new Error('invalid fractional amount')

  const fracPadded = (frac + '0'.repeat(decimals)).slice(0, decimals)
  const baseMultiplier = (() => {
    let m = BigInt(1)
    for (let i = 0; i < decimals; i++) m *= BigInt(10)
    return m
  })()
  const base = BigInt(whole || '0') * baseMultiplier
  const fracPart = BigInt(fracPadded || '0')

  return (base + fracPart).toString()
}

export function buildEip681Erc20Transfer(params: {
  tokenContract: string // ERC-20 contract address (USDC contract on Base)
  recipient: string // your deposit address
  amount: string | number // human amount, e.g. "12.5"
  chainId?: number // default Base 8453
  decimals?: number // default USDC 6
}): string {
  const chainId = params.chainId ?? BASE_CHAIN_ID
  const decimals = params.decimals ?? 6

  const token = params.tokenContract
  const to = params.recipient

  if (!token || !token.startsWith('0x'))
    throw new Error('Invalid tokenContract')
  if (!to || !to.startsWith('0x')) throw new Error('Invalid recipient')

  const uint256 = toBaseUnits(params.amount, decimals)

  // EIP-681 format for contract call:
  // ethereum:<contract>@<chainId>/transfer?address=<to>&uint256=<amount>
  return `ethereum:${token}@${chainId}/transfer?address=${to}&uint256=${uint256}`
}
