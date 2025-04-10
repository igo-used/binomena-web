"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { sendTransaction, getWalletBalance } from "@/lib/api"
import Link from "next/link"

export default function SendTokensPage() {
  const searchParams = useSearchParams()
  const [fromAddress, setFromAddress] = useState(searchParams.get("from") || "")
  const [toAddress, setToAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ txId: string } | null>(null)

  useEffect(() => {
    if (fromAddress) {
      fetchBalance()
    }
  }, [fromAddress])

  const fetchBalance = async () => {
    try {
      const result = await getWalletBalance(fromAddress)
      setBalance(result.balance)
    } catch (err) {
      console.error("Failed to fetch balance:", err)
    }
  }

  const handleSendTransaction = async () => {
    // Validate inputs
    if (!fromAddress.trim()) {
      setError("Please enter a sender address")
      return
    }
    if (!toAddress.trim()) {
      setError("Please enter a recipient address")
      return
    }
    if (!amount.trim() || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }
    if (!privateKey.trim()) {
      setError("Please enter your private key")
      return
    }

    const amountValue = Number.parseFloat(amount)
    if (balance !== null && amountValue > balance) {
      setError("Insufficient balance")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await sendTransaction(fromAddress, toAddress, amountValue, privateKey)
      setSuccess({ txId: result.txId })
      // Clear form
      setToAddress("")
      setAmount("")
      setPrivateKey("")
      // Refresh balance
      fetchBalance()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send transaction")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Send Tokens</h1>
        <p className="max-w-[700px] text-muted-foreground">Transfer BNM tokens to another wallet</p>
      </div>

      <div className="max-w-md mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
            <AlertTitle>Transaction Successful</AlertTitle>
            <AlertDescription>
              Your transaction has been submitted successfully.
              <br />
              Transaction ID: {success.txId}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Send Tokens</CardTitle>
            <CardDescription>Transfer BNM tokens to another wallet address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromAddress">From Address</Label>
              <Input
                id="fromAddress"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                placeholder="Your wallet address"
              />
              {balance !== null && <p className="text-sm text-muted-foreground">Available Balance: {balance} BNM</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="toAddress">To Address</Label>
              <Input
                id="toAddress"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="Recipient wallet address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (BNM)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount to send"
                min="0.000001"
                step="0.000001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="privateKey">Private Key</Label>
              <Input
                id="privateKey"
                type="password"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="Your private key"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your private key is required to sign the transaction. It is never stored or sent to our servers.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link href="/wallet">Back to Wallet</Link>
            </Button>
            <Button onClick={handleSendTransaction} disabled={loading}>
              {loading ? "Sending..." : "Send Tokens"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
