"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, AlertCircle, CheckCircle2 } from "lucide-react"
import { createWallet } from "@/lib/api"
import Link from "next/link"

export default function CreateWalletPage() {
  const [wallet, setWallet] = useState<{ address: string; privateKey: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState({ address: false, privateKey: false })

  const handleCreateWallet = async () => {
    setLoading(true)
    setError(null)

    try {
      const newWallet = await createWallet()
      setWallet(newWallet)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create wallet")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, field: "address" | "privateKey") => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [field]: true })
    setTimeout(() => {
      setCopied({ ...copied, [field]: false })
    }, 2000)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Create a New Wallet</h1>
        <p className="max-w-[700px] text-muted-foreground">
          Generate a new Binomena wallet with a unique address and private key
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

        {!wallet ? (
          <Card>
            <CardHeader>
              <CardTitle>Create Wallet</CardTitle>
              <CardDescription>Click the button below to generate a new wallet</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={handleCreateWallet} className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Wallet"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Wallet Created Successfully</CardTitle>
              <CardDescription>
                Store your private key securely. You will need it to access your wallet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Wallet Address</Label>
                <div className="flex">
                  <Input id="address" value={wallet.address} readOnly className="flex-1 font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => copyToClipboard(wallet.address, "address")}
                  >
                    {copied.address ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="privateKey">Private Key</Label>
                <div className="flex">
                  <Input
                    id="privateKey"
                    value={wallet.privateKey}
                    readOnly
                    className="flex-1 font-mono text-sm"
                    type="password"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => copyToClipboard(wallet.privateKey, "privateKey")}
                  >
                    {copied.privateKey ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Save your private key securely. If you lose it, you will lose access to your wallet and funds.
                </AlertDescription>
              </Alert>
              <div className="flex gap-4 w-full">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/wallet">Back to Wallet</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href={`/wallet/balance?address=${wallet.address}`}>Check Balance</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
