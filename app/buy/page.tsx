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
import { AlertCircle, CreditCard, Wallet, CheckCircle2 } from "lucide-react"

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

  const handleBuyTokens = async () => {
    // Validate inputs
    if (!amount.trim() || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }
    if (!walletAddress.trim() || !walletAddress.startsWith("AdNe")) {
      setError("Please enter a valid Binomena wallet address")
      return
    }

    if (paymentMethod === "credit-card") {
      if (!cardName.trim()) {
        setError("Please enter the name on your card")
        return
      }
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, "").length !== 16) {
        setError("Please enter a valid card number")
        return
      }
      if (!cardExpiry.trim() || !cardExpiry.includes("/")) {
        setError("Please enter a valid expiry date (MM/YY)")
        return
      }
      if (!cardCvc.trim() || cardCvc.length < 3) {
        setError("Please enter a valid CVC code")
        return
      }
    }

    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, you would call your payment processor API here
      // and then use the faucet endpoint to transfer tokens to the user's wallet

      setSuccess(true)

      // Clear form
      setAmount("")
      setCardName("")
      setCardNumber("")
      setCardExpiry("")
      setCardCvc("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process payment")
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value)
    setCardNumber(formattedValue)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }

    setCardExpiry(value)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Buy BNM Tokens</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Purchase Binom tokens directly with your credit card
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                Purchase Successful
              </CardTitle>
              <CardDescription>Your token purchase has been processed successfully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Your BNM tokens have been sent to your wallet. They should appear in your wallet balance shortly.</p>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Transaction Details</p>
                <p className="text-sm">Wallet: {walletAddress}</p>
                <p className="text-sm">Amount: {Number.parseFloat(amount).toLocaleString()} BNM</p>
                <p className="text-sm">Payment Method: {paymentMethod === "credit-card" ? "Credit Card" : "Crypto"}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setSuccess(false)} className="w-full">
                Buy More Tokens
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Buy BNM Tokens</CardTitle>
              <CardDescription>Purchase tokens to use on the Binomena blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (BNM)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount to buy"
                  min="1"
                />
                {amount && !isNaN(Number.parseFloat(amount)) && (
                  <p className="text-sm text-muted-foreground">
                    Estimated cost: ${(Number.parseFloat(amount) * 0.1).toFixed(2)} USD
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your Binomena wallet address"
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Tabs defaultValue="credit-card" onValueChange={setPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="credit-card">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Credit Card
                    </TabsTrigger>
                    <TabsTrigger value="crypto">
                      <Wallet className="mr-2 h-4 w-4" />
                      Crypto
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="credit-card" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvc">CVC</Label>
                        <Input
                          id="cardCvc"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="crypto" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Select Cryptocurrency</Label>
                      <RadioGroup defaultValue="btc">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="btc" id="btc" />
                          <Label htmlFor="btc">Bitcoin (BTC)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="eth" id="eth" />
                          <Label htmlFor="eth">Ethereum (ETH)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="usdt" id="usdt" />
                          <Label htmlFor="usdt">Tether (USDT)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Coming Soon</AlertTitle>
                      <AlertDescription>
                        Crypto payments are coming soon. Please use credit card for now.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBuyTokens} className="w-full" disabled={loading || paymentMethod === "crypto"}>
                {loading ? "Processing..." : "Buy Tokens"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
