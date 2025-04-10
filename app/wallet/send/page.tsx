"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, AlertTriangle, ShieldAlert, Eye, EyeOff } from "lucide-react"
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
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showPrivateKey, setShowPrivateKey] = useState(false)

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

  const validateInputs = () => {
    if (!fromAddress.trim()) {
      setError("Please enter a sender address")
      return false
    }
    if (!toAddress.trim()) {
      setError("Please enter a recipient address")
      return false
    }
    if (!amount.trim() || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return false
    }
    if (!privateKey.trim()) {
      setError("Please enter your private key")
      return false
    }

    const amountValue = Number.parseFloat(amount)
    if (balance !== null && amountValue > balance) {
      setError("Insufficient balance")
      return false
    }
    
    return true
  }

  const handlePrepareTransaction = () => {
    setError(null)
    if (validateInputs()) {
      setShowConfirmation(true)
    }
  }

  const handleSendTransaction = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const amountValue = Number.parseFloat(amount)
      const result = await sendTransaction(fromAddress, toAddress, amountValue, privateKey)
      setSuccess({ txId: result.txId })
      // Clear form
      setToAddress("")
      setAmount("")
      setPrivateKey("")
      setShowConfirmation(false)
      // Refresh balance
      fetchBalance()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send transaction")
    } finally {
      setLoading(false)
    }
  }

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Send Tokens</h1>
        <p className="max-w-[700px] text-muted-foreground">Transfer BNM tokens to another wallet</p>
      </div>

      {/* Critical Warning Alert */}
      <div className="max-w-md mx-auto mb-6">
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900">
          <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-500" />
          <AlertTitle className="text-red-800 dark:text-red-400 font-bold">IMPORTANT: Transactions Cannot Be Reversed</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300">
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
              <li><strong>Double-check the recipient address</strong> - even a single incorrect character will result in permanent loss of tokens</li>
              <li><strong>Verify the amount</strong> - once sent, tokens cannot be recovered</li>
              <li><strong>Keep your private key secure</strong> - never share it with anyone</li>
              <li><strong>You are solely responsible</strong> for verifying all transaction details</li>
            </ul>
          </AlertDescription>
        </Alert>
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

        <Card className="shadow-md">
          <CardHeader className="border-b">
            <CardTitle>Send Tokens</CardTitle>
            <CardDescription>Transfer BNM tokens to another wallet address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="fromAddress" className="flex items-center">
                From Address
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="fromAddress"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                placeholder="Your wallet address"
                className="font-mono text-sm"
              />
              {balance !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Balance:</span> 
                  <span className={balance > 0 ? "font-medium" : "text-red-500 font-medium"}>
                    {balance} BNM
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="toAddress" className="flex items-center">
                To Address
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="toAddress"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="Recipient wallet address"
                className="font-mono text-sm"
              />
              <p className="text-xs text-amber-600 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Double-check every character - incorrect addresses cannot be recovered
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center">
                Amount (BNM)
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount to send"
                min="0.000001"
                step="0.000001"
              />
              <p className="text-xs text-amber-600 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Verify the amount - transactions cannot be reversed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="privateKey" className="flex items-center">
                Private Key
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="privateKey"
                  type={showPrivateKey ? "text" : "password"}
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="Your private key"
                  className="font-mono text-sm pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your private key is required to sign the transaction. It is never stored or sent to our servers.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button asChild variant="outline">
              <Link href="/wallet">Back to Wallet</Link>
            </Button>
            <Button onClick={handlePrepareTransaction} disabled={loading || showConfirmation}>
              {loading ? "Sending..." : "Review Transaction"}
            </Button>
          </CardFooter>
        </Card>

        {/* Transaction Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-md w-full shadow-xl">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Confirm Transaction</h3>
                <div className="space-y-4 mb-6">
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-700 text-sm">
                      Please carefully verify all transaction details. This action cannot be undone.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="bg-muted p-4 rounded-md space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">From:</span>
                      <span className="font-mono text-sm truncate max-w-[200px]" title={fromAddress}>
                        {fromAddress}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">To:</span>
                      <span className="font-mono text-sm truncate max-w-[200px]" title={toAddress}>
                        {toAddress}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">Amount:</span>
                      <span className="font-medium text-sm">{amount} BNM</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button variant="outline" className="flex-1" onClick={() => setShowConfirmation(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleSendTransaction} disabled={loading}>
                    {loading ? "Sending..." : "Confirm & Send"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}