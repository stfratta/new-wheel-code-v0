import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            Risk-it Shop
          </Link>
          <Link href="/checkout">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold">Risk-it Shirt</h1>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600">
            Get our amazing shirt for just $40, and spin the wheel for a chance to get it completely FREE!
          </p>
        </section>

        <section className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex items-center justify-center rounded-lg bg-gray-100 p-8">
              <img src="/images/risk-it-shirt.png" alt="Risk-it shirt" className="h-auto max-w-full rounded-md" />
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h2 className="mb-2 text-3xl font-bold">Risk-it Shirt</h2>
                <p className="text-xl font-semibold text-gray-900">$40.00</p>
                <div className="mt-4 flex items-center">
                  <span className="mr-2 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    In Stock
                  </span>
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                    Spin the Wheel Eligible
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-4 text-gray-600">
                  Our premium shirt is made from high-quality materials, ensuring comfort and durability. Perfect for
                  any occasion, this shirt will quickly become your favorite wardrobe item.
                </p>
                <ul className="mb-6 space-y-2 text-gray-600">
                  <li>• 100% premium cotton</li>
                  <li>• Comfortable fit</li>
                  <li>• Machine washable</li>
                  <li>• Available in multiple sizes</li>
                </ul>
              </div>

              <div className="mt-2 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                <Link href="/checkout" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full">
                    Buy Now - $40.00
                  </Button>
                </Link>
              </div>

              <div className="mt-4 rounded-md bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-bold">Special Offer:</span> After checkout, spin the wheel for a chance to get
                  your shirt completely FREE (100% off) or keep the regular price (0% off)!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Risk-it Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
