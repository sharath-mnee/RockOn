export interface Product {
  id: string
  name: string
  description: string
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
