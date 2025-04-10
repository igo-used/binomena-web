"use client"

import { useState } from "react"
import { createWallet } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ApiDebug } from "@/components/api-debug"

export default function CreateWalletPage() {
  const [wallet, setWallet] = useState<{ address: string; privateKey: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateWallet = async () => {
    setLoading(true)
    setError(null)
    try {
      const newWallet = await createWallet()
      setWallet(newWallet)
    } catch (err: any) {
      console.error("Error creating wallet:", err)
      setError(err.message || "Failed to create wallet")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Wallet</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create a New Binomena Wallet</CardTitle>
          <CardDescription>Generate a new wallet address and private key for the Binomena blockchain.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleCreateWallet} disabled={loading} className="w-full mb-4">
            {loading ? "Creating..." : "Create New Wallet"}
          </Button>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {wallet && (
            <div className="mt-4 p-4 border rounded-md bg-muted">
              <div className="mb-2">
                <span className="font-semibold">Address:</span>
                <div className="break-all bg-background p-2 rounded mt-1">{wallet.address}</div>
              </div>
              <div>
                <span className="font-semibold">Private Key:</span>
                <div className="break-all bg-background p-2 rounded mt-1">{wallet.privateKey}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Important: Save this private key securely. It cannot be recovered if lost.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add the API Debug component */}
      <ApiDebug />
    </div>
  )
}
