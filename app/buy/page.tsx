"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CreditCard, Wallet, CheckCircle2, Timer, TrendingUp, Users, Mail, ExternalLink, Copy } from "lucide-react"
import Link from "next/link"
import { PresaleAPI, type PaymentDetails } from "@/lib/presale-api"

export default function BuyTokensPage() {
  const [amount, setAmount] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("crypto")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [copied, setCopied] = useState(false)

  // Presale configuration
  const presaleConfig = {
    // Stage 1: June 1 - December 31, 2025
    stage1: {
      totalTokens: 35000000, // 35M tokens
      soldTokens: 250000,   // 2.5M sold so far (example)
      price: 0.09,           // $0.09 per token
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-12-31'),
    },
    // Stage 2: Next presale stage
    stage2: {
      totalTokens: 20000000, // 20M tokens
      price: 0.40,           // $0.40 per token
    },
    // Stage 3: Final presale stage
    stage3: {
      totalTokens: 20000000, // 20M tokens
      price: 0.80,           // $0.80 per token
    },
    // Current active stage
    currentStage: 1,
    minPurchase: 1000,      // Minimum 1000 tokens
    maxPurchase: 1000000,   // Maximum 1M tokens per transaction
  }

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = presaleConfig.stage1.endDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const progressPercentage = (presaleConfig.stage1.soldTokens / presaleConfig.stage1.totalTokens) * 100
  const tokenAmount = parseInt(amount) || 0
  const totalCost = tokenAmount * presaleConfig.stage1.price

  const handlePurchase = async () => {
    if (!amount || !walletAddress) {
      setError("Please enter token amount and wallet address")
      return
    }

    if (tokenAmount < presaleConfig.minPurchase) {
      setError(`Minimum purchase is ${presaleConfig.minPurchase.toLocaleString()} tokens`)
      return
    }

    if (tokenAmount > presaleConfig.maxPurchase) {
      setError(`Maximum purchase is ${presaleConfig.maxPurchase.toLocaleString()} tokens`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const purchase = {
        amount: tokenAmount,
        walletAddress,
        paymentMethod: paymentMethod as 'crypto' | 'bank',
        totalCost: totalCost
      }

      const result = await PresaleAPI.submitPurchase(purchase)
      
      if (result.success && result.paymentDetails) {
        setPaymentDetails(result.paymentDetails)
        setSuccess(true)
      } else {
        setError(result.error || "Purchase failed. Please try again.")
      }
    } catch (err) {
      setError("Purchase failed. Please try again or contact support.")
    } finally {
      setLoading(false)
    }
  }

  const copyWalletAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (success && paymentDetails) {
    return (
      <div className="container py-10">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Wallet className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-blue-700">Payment Instructions</CardTitle>
              <CardDescription>Please send USDT to complete your BNM token purchase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Tokens:</strong> {tokenAmount.toLocaleString()} BNM</p>
                <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)} USDT</p>
                <p><strong>Your Wallet:</strong> {walletAddress}</p>
                <p><strong>Purchase ID:</strong> {paymentDetails.purchaseId}</p>
              </div>

              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-700">Important: Send Exact Amount</AlertTitle>
                <AlertDescription className="text-amber-600">
                  Send exactly <strong>${paymentDetails.amount} USDT</strong> - not more, not less
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">🔥 Recommended: TRC20 (Lower Fees ~$1)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value="THuThsfwY4eJDpioegkTCHcFkihZurm5u4"
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyWalletAddress("THuThsfwY4eJDpioegkTCHcFkihZurm5u4")}
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">Alternative: Polygon Network</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value="0xa5b06e68abc3750cbbce81df27806a05c82238a4"
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyWalletAddress("0xa5b06e68abc3750cbbce81df27806a05c82238a4")}
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Payment Instructions:</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>1. Open your crypto wallet (Binance, Trust Wallet, MetaMask, etc.)</p>
                    <p>2. Send exactly <strong>${paymentDetails.amount} USDT</strong></p>
                    <p>3. Choose <strong>TRC20 network</strong> for lowest fees (~$1)</p>
                    <p>4. Or use <strong>Polygon network</strong> if you prefer</p>
                    <p>5. Copy the correct address carefully</p>
                    <p>6. Your BNM tokens will be sent within 2-4 hours</p>
                  </div>
                </div>

                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>What happens next?</AlertTitle>
                  <AlertDescription>
                    After sending USDT, please submit your payment proof using the form below. We will send {tokenAmount.toLocaleString()} BNM tokens to your wallet within 2-4 hours of verification.
                  </AlertDescription>
                </Alert>

                {/* Payment Proof Submission */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3">📋 Submit Payment Proof</h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-green-700">
                      After sending USDT, please email us with your payment proof:
                    </p>
                    <div className="bg-white p-3 rounded border">
                      <p className="font-mono text-xs text-gray-700">
                        <strong>To:</strong> juxhino.kap@yahoo.com<br/>
                        <strong>Subject:</strong> BNM Token Purchase - {paymentDetails.purchaseId}<br/><br/>
                        
                        <strong>Purchase Details:</strong><br/>
                        • Purchase ID: {paymentDetails.purchaseId}<br/>
                        • Tokens: {tokenAmount.toLocaleString()} BNM<br/>
                        • Amount Paid: ${paymentDetails.amount} USDT<br/>
                        • My BNM Wallet: {walletAddress}<br/><br/>
                        
                        <strong>Payment Proof:</strong><br/>
                        • Network Used: [TRC20 or Polygon]<br/>
                        • Transaction Hash: [Your TX Hash]<br/>
                        • Screenshot: [Attach payment screenshot]<br/>
                      </p>
                    </div>
                    <Button 
                      asChild 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        const subject = `BNM Token Purchase - ${paymentDetails.purchaseId}`
                        const body = `Purchase Details:
• Purchase ID: ${paymentDetails.purchaseId}
• Tokens: ${tokenAmount.toLocaleString()} BNM
• Amount Paid: $${paymentDetails.amount} USDT
• My BNM Wallet: ${walletAddress}

Payment Proof:
• Network Used: [TRC20 or Polygon]
• Transaction Hash: [Your TX Hash]
• Screenshot: [Please attach payment screenshot]

Please confirm receipt and send my BNM tokens.

Thank you!`
                        
                        window.location.href = `mailto:juxhino.kap@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                      }}
                    >
                      📧 Send Payment Proof Email
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex gap-4 w-full">
                <Button variant="outline" onClick={() => { setSuccess(false); setPaymentDetails(null) }} className="flex-1">
                  Make Another Purchase
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/wallet">Check Wallet</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Need help? Contact our support team below.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <TrendingUp className="h-3 w-3 mr-1" />
            Presale Live
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">BNM Token Presale</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Secure your BNM tokens at the best presale price before public launch
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
        {/* Presale Stats */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Presale Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tokens Sold</span>
                <span>{presaleConfig.stage1.soldTokens.toLocaleString()} / {presaleConfig.stage1.totalTokens.toLocaleString()}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {progressPercentage.toFixed(1)}% Complete
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-2xl font-bold">{timeLeft.days}</div>
                <div className="text-xs text-muted-foreground">Days</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-2xl font-bold">{timeLeft.hours}</div>
                <div className="text-xs text-muted-foreground">Hours</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                <div className="text-xs text-muted-foreground">Seconds</div>
              </div>
            </div>

            {/* Pricing Tiers */}
            <div className="space-y-3">
              <h3 className="font-semibold">Pricing Tiers</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="font-medium">Current Price</span>
                  <Badge className="bg-green-100 text-green-800">${presaleConfig.stage1.price}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span>Stage 2 Price</span>
                  <span className="text-muted-foreground">${presaleConfig.stage2.price}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span>Stage 3 Price</span>
                  <span className="text-muted-foreground">${presaleConfig.stage3.price}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span>Public Launch</span>
                  <span className="text-muted-foreground">$1.00+</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Purchase BNM Tokens</CardTitle>
            <CardDescription>Enter the amount of tokens you want to purchase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Token Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder={`Min: ${presaleConfig.minPurchase.toLocaleString()}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={presaleConfig.minPurchase}
                max={presaleConfig.maxPurchase}
              />
              <p className="text-xs text-muted-foreground">
                Min: {presaleConfig.minPurchase.toLocaleString()} • Max: {presaleConfig.maxPurchase.toLocaleString()} tokens
              </p>
            </div>

            {tokenAmount > 0 && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-bold">${totalCost.toFixed(2)} USD</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="wallet">Your Wallet Address</Label>
              <Input
                id="wallet"
                placeholder="Enter your Binomena wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="crypto" id="crypto" />
                  <Label htmlFor="crypto" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Cryptocurrency (USDT/USDC)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Bank Transfer
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === "crypto" && (
              <Alert>
                <Wallet className="h-4 w-4" />
                <AlertTitle>Crypto Payment</AlertTitle>
                <AlertDescription>
                  Send USDT/USDC to our payment address. Instructions will be provided after clicking purchase.
                </AlertDescription>
              </Alert>
            )}

            {paymentMethod === "bank" && (
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertTitle>Bank Transfer</AlertTitle>
                <AlertDescription>
                  Bank details will be provided for wire transfer. Processing may take 1-3 business days.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              onClick={handlePurchase}
              disabled={loading || !amount || !walletAddress}
              className="w-full"
            >
              {loading ? "Processing..." : `Purchase ${tokenAmount.toLocaleString()} BNM Tokens`}
            </Button>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Need help or have questions?
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:juxhino.kap@yahoo.com">
                    <Mail className="h-4 w-4 mr-1" />
                    Email Support
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.instagram.com/juxhino_kapllanaj/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Instagram
                  </a>
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Additional Information */}
      <div className="max-w-4xl mx-auto mt-12 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <CardTitle className="text-lg">Secure Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              All transactions are secured and tokens are held in escrow until distribution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <CardTitle className="text-lg">Early Adopter Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Get the best price and exclusive access to Binomena ecosystem features
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <CardTitle className="text-lg">Guaranteed Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Tokens delivered within 24-48 hours of confirmed payment
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}