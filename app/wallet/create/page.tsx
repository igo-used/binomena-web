"use client"

import { useState } from "react"
import { createWallet } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ApiDebug } from "@/components/api-debug"
import { Copy, CheckCircle, Wallet, Shield, AlertTriangle, Lock, Save } from "lucide-react"

export default function CreateWalletPage() {
  const [wallet, setWallet] = useState<{ address: string; privateKey: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<{ address: boolean; privateKey: boolean }>({ address: false, privateKey: false })

  const handleCreateWallet = async () => {
    setLoading(true)
    setError(null)
    try {
      const newWallet = await createWallet()
      setWallet(newWallet)
      setCopied({ address: false, privateKey: false })
    } catch (err: any) {
      console.error("Error creating wallet:", err)
      setError(err.message || "Failed to create wallet")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, type: 'address' | 'privateKey') => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [type]: true })
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000)
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Create New Wallet</h1>
        <p className="text-muted-foreground">Generate a secure wallet for the Binomena blockchain</p>
      </div>

      {/* Security Alert */}
      {!wallet && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="ml-2 text-amber-800">Important Security Notice</AlertTitle>
          <AlertDescription className="ml-7 text-amber-700">
            <ul className="list-disc space-y-1 pl-4 mt-2">
              <li>Create only ONE wallet and save the private key securely</li>
              <li>Never share your private key with anyone</li>
              <li>Loss of your private key means permanent loss of access to your funds</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-6 h-6" />
            <CardTitle>Create a New Binomena Wallet</CardTitle>
          </div>
          <CardDescription>Generate a new wallet address and private key for the Binomena blockchain.</CardDescription>
        </CardHeader>
        <CardContent>
          {!wallet ? (
            <Button 
              onClick={handleCreateWallet} 
              disabled={loading} 
              className="w-full mb-6 py-6 text-lg font-medium rounded-lg transition-all hover:shadow-md"
            >
              {loading ? "Creating..." : "Create New Wallet"}
            </Button>
          ) : (
            <div className="flex justify-center mb-4">
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" /> Wallet created successfully
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="ml-2">Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {wallet && (
            <div className="mt-4 border rounded-lg overflow-hidden">
              {/* Wallet Info Header */}
              <div className="bg-muted p-4 border-b">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">Your Wallet Information</h3>
                </div>
              </div>
              
              {/* Wallet Info Content */}
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">Address:</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => copyToClipboard(wallet.address, 'address')}
                    >
                      {copied.address ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      <span className="ml-1">{copied.address ? 'Copied!' : 'Copy'}</span>
                    </Button>
                  </div>
                  <div className="break-all bg-muted p-3 rounded-md text-sm font-mono">{wallet.address}</div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">Private Key:</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => copyToClipboard(wallet.privateKey, 'privateKey')}
                    >
                      {copied.privateKey ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      <span className="ml-1">{copied.privateKey ? 'Copied!' : 'Copy'}</span>
                    </Button>
                  </div>
                  <div className="break-all bg-muted p-3 rounded-md text-sm font-mono">{wallet.privateKey}</div>
                </div>
                
                {/* Enhanced Security Warning */}
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 mt-6">
                  <div className="flex items-start">
                    <Lock className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-red-700 mb-2">CRITICAL: Secure Your Private Key</h4>
                      <ul className="list-disc space-y-2 pl-5 text-sm text-red-700">
                        <li><strong>Write down your private key</strong> on paper and store it in a secure location</li>
                        <li><strong>Consider using a hardware wallet</strong> for long-term storage</li>
                        <li><strong>Never store your private key</strong> in plain text on your computer or cloud storage</li>
                        <li><strong>Do not create multiple wallets</strong> - use this one wallet and secure it properly</li>
                        <li><strong>There is no way to recover</strong> your private key if lost</li>
                      </ul>
                      <div className="mt-3 flex items-center text-red-800">
                        <Save className="h-4 w-4 mr-1" />
                        <span className="font-medium">Save this information NOW before leaving this page</span>
                      </div>
                    </div>
                  </div>
                </div>
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