"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export default function CheckoutPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  if (formSubmitted) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col px-4 py-12">
        <Link href="/" className="mb-8 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mx-auto max-w-md text-center">
          <h1 className="mb-6 text-3xl font-bold">Order Placed!</h1>
          <p className="mb-8 text-gray-600">
            Your order has been placed successfully. Now it's time for the exciting part!
          </p>

          <Link href="/spin">
            <Button size="lg" className="w-full">
              Spin the Wheel Now
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col px-4 py-12">
      <Link href="/" className="mb-8 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
              <CardDescription>Complete your purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" required />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Shipping Address</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" required />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" required />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Method</h3>
                  <RadioGroup defaultValue="card">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Credit Card
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="expMonth">Expiry Month</Label>
                        <Input id="expMonth" placeholder="MM" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="expYear">Expiry Year</Label>
                        <Input id="expYear" placeholder="YY" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Place Order
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded bg-gray-100"></div>
                  <div>
                    <p className="font-medium">Risk-it Shirt</p>
                    <p className="text-sm text-gray-500">Quantity: 1</p>
                  </div>
                </div>
                <p className="font-medium">$40.00</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>$40.00</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>$0.00</p>
                </div>
                <div className="flex justify-between">
                  <p>Tax</p>
                  <p>$0.00</p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-medium">
                <p>Total</p>
                <p>$40.00</p>
              </div>

              <div className="mt-4 rounded-md bg-red-50 p-4">
                <p className="text-sm font-bold text-red-800">
                  IMPORTANT: All sales are final. No refunds will be provided under any circumstances.
                </p>
              </div>

              <div className="mt-4 rounded-md bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-bold">Remember:</span> After checkout, you'll get to spin the wheel for a chance
                  to get your shirt completely FREE!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
