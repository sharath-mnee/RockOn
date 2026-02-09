export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  sizes: string[]
  rating: number
  reviews: number
  badge?: 'Best seller' | 'New' | '5% off'
}

export interface CartItem {
  product: Product
  size: string
  quantity: number
}

export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface OrderSummary {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export type PaymentMethod = 'card' | 'stablecoin' | 'paypal' | 'klarna'
