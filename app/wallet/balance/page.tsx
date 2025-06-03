"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Search, ArrowRight } from "lucide-react"
import { getWalletBalance } from "@/lib/api"
import Link from "next/link"
import { TokenLogo } from "@/components/ui/token-logo"

export default function BalancePage() {
  const searchParams = useSearchParams()
  const [address, setAddress] = useState(searchParams.get("address") || "")
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get("address")) {
      checkBalance()
    }
  }, [searchParams])

  const checkBalance = async () => {
    if (!address.trim()) {
      setError("Please enter a wallet address")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await getWalletBalance(address)
      setBalance(result.balance)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get balance")
      setBalance(null)
    } finally {
      setLoading(false)
    }
  }

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <div className="flex items-center gap-4 mb-4">
          <TokenLogo symbol="BNM" size="xl" />
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Check Wallet Balance</h1>
            <p className="text-muted-foreground">View your Binomena wallet balance</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription>Enter your wallet address to check your balance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Wallet Address</Label>
              <div className="flex">
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter wallet address"
                  className="flex-1"
                />
                <Button variant="outline" size="icon" className="ml-2" onClick={checkBalance} disabled={loading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {balance !== null && (
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center gap-4">
                  <TokenLogo symbol="BNM" size="lg" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{formatBalance(balance)} BNM</div>
                    <div className="text-sm text-muted-foreground">Binomena Native Tokens</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link href="/wallet">Back to Wallet</Link>
            </Button>
            {balance !== null && (
              <Button asChild>
                <Link href={`/wallet/send?from=${address}`}>
                  Send Tokens
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
