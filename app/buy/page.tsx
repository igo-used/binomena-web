"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CreditCard, Wallet, CheckCircle2, Construction, Mail, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function BuyTokensPage() {
  const [amount, setAmount] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Credit card form state
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Buy BNM Tokens</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Become an early investor in the Binomena blockchain ecosystem
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="shadow-lg overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-3">
            <div className="flex items-center gap-2">
              <Construction className="h-5 w-5 text-amber-600" />
              <p className="font-medium text-amber-800">Online Purchase Coming Soon</p>
            </div>
          </div>

          <CardHeader>
            <CardTitle>Early Investor Opportunity</CardTitle>
            <CardDescription>Connect directly with the founder to purchase Binom tokens at the most favorable early investor rates</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="bg-blue-50 border-blue-100">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-700">Exclusive Opportunity</AlertTitle>
              <AlertDescription className="text-blue-600">
                The public token sale platform is under development. Currently, token purchases are available exclusively through direct communication with the project founder.
              </AlertDescription>
            </Alert>

            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-semibold text-lg">Contact the Founder</h3>
              
              <div className="flex items-start gap-3 p-3 rounded-md bg-muted">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Email:</p>
                  <a 
                    href="mailto:juxhino.kap@yahoo.com" 
                    className="text-blue-600 hover:underline break-all"
                  >
                    juxhino.kap@yahoo.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-md bg-muted">
                <ExternalLink className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Instagram:</p>
                  <a 
                    href="https://www.instagram.com/juxhino_kapllanaj/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline"
                  >
                    @juxhino_kapllanaj
                  </a>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Reach out to discuss investment opportunities as an early adopter and secure tokens at the most reasonable prices before public launch.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Why Invest Early?</h3>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Best possible token pricing before public launch</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Direct communication with the project founder</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Early access to Binomena ecosystem features</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Ground-floor opportunity in a growing blockchain project</span>
                </li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t p-6">
            <p className="text-sm text-muted-foreground text-center">
              Online token purchase functionality will be available soon. Until then, please contact the founder directly.
            </p>
            <div className="flex gap-4 w-full">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/wallet">Back to Wallet</Link>
              </Button>
              <Button 
                asChild
                className="flex-1"
              >
                <a href="mailto:juxhino.kap@yahoo.com">Contact Founder</a>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}