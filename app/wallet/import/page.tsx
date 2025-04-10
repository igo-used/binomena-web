"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, AlertCircle, CheckCircle2 } from "lucide-react"
import { importWallet } from "@/lib/api"
import Link from "next/link"

export default function ImportWalletPage() {
  const [privateKey, setPrivateKey] = useState("")
  const [wallet, setWallet] = useState<{ address: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleImportWallet = async () => {
    if (!privateKey.trim()) {
      setError("Please enter a private key")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const importedWallet = await importWallet(privateKey)
      setWallet(importedWallet)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import wallet")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Import Wallet</h1>
        <p className="max-w-[700px] text-muted-foreground">Import an existing wallet using your private key</p>
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
              <CardTitle>Import Wallet</CardTitle>
              <CardDescription>Enter your private key to import your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="privateKey">Private Key</Label>
                <Input
                  id="privateKey"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="Enter your private key"
                  className="font-mono"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleImportWallet} className="w-full" disabled={loading}>
                {loading ? "Importing..." : "Import Wallet"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Wallet Imported Successfully</CardTitle>
              <CardDescription>Your wallet has been imported successfully</CardDescription>
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
                    onClick={() => copyToClipboard(wallet.address)}
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
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
