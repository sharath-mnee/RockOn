import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white px-4 sm:px-6 md:px-8 lg:px-6 mx-auto">
      <div className="mx-auto border-t pt-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 md:gap-20">
          <div className="md:w-2/3 flex flex-col mt-4">
            <Link href="/" className="text-2xl font-bold text-brand-orange">
              ROCK ON
            </Link>
            <p className="text-[#737373] mt-6 text-sm leading-relaxed">
              Official merchandise from the world's biggest rock artists and
              tours.
            </p>
          </div>

          <div className="md:w-3/4 grid grid-cols-3 gap-8 md:gap-20">
            <div>
              <h3 className="font-semibold mb-3">Shop</h3>
              <ul className="space-y-2 text-sm text-[#737373]">
                <li>
                  <Link
                    href="/"
                    className="hover:text-brand-orange transition-colors"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Collections
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-[#737373]">
                <li>
                  <Link
                    href="/"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Returns
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-[#737373]">
                <li>
                  <Link
                    href="/"
                    className="hover:text-brand-orange transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t mt-4 pt-4 pb-6 text-center text-sm text-[#737373]">
          ©️ 2026 Rock On. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
