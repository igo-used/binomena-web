"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins, DollarSign, ArrowRight, Calculator } from "lucide-react"
import { useState } from "react"
import { getWalletBalance } from "@/lib/api"

export default function WalletPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <Coins className="h-16 w-16 text-primary" />
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">BNM Wallet</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
          Manage your Binomena (BNM) tokens and interact with the blockchain
        </p>
      </div>

      {/* PAPRD Wallet Alert */}
      <Alert className="mb-8">
        <DollarSign className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Looking for PAPRD stablecoin management? Use our dedicated PAPRD wallet.</span>
          <Button asChild variant="outline" size="sm">
            <Link href="/wallet/paprd" className="flex items-center gap-2">
              PAPRD Wallet <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </AlertDescription>
      </Alert>

      {/* Quick Balance Checker */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Quick BNM Balance Checker
          </CardTitle>
          <CardDescription>
            Check BNM balance and transaction fees for any Binomena address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BNMBalanceChecker />
            <TransactionFeeInfo />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Create BNM Wallet
            </CardTitle>
            <CardDescription>Generate a new wallet address and private key</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create a new wallet to store your BNM tokens and interact with the Binomena blockchain.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/wallet/create">Create New Wallet</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Import BNM Wallet</CardTitle>
            <CardDescription>Import an existing wallet using private key</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Already have a BNM wallet? Import it using your private key to access your funds.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/wallet/import">Import Wallet</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Check BNM Balance</CardTitle>
            <CardDescription>View your BNM token balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Check the BNM balance of any wallet address on the Binomena blockchain.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/wallet/balance">Check Balance</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Send BNM Tokens</CardTitle>
            <CardDescription>Transfer BNM tokens to another wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Send BNM tokens to another wallet address on the Binomena blockchain.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/wallet/send">Send Tokens</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>BNM Transaction History</CardTitle>
            <CardDescription>View your BNM transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">View all BNM transactions associated with your wallet address.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/wallet/history">View History</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              PAPRD Stablecoin
            </CardTitle>
            <CardDescription>Access PAPRD stablecoin wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage PAPRD stablecoin tokens with dedicated wallet interface and advanced features.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/wallet/paprd">Open PAPRD Wallet</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Commented out the Request Tokens card */}
        {/* <Card className="card-hover">
          <CardHeader>
            <CardTitle>Request Tokens</CardTitle>
            <CardDescription>Request tokens from the faucet (admin only)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Request tokens from the Binomena faucet (requires admin key).
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/wallet/faucet">Request Tokens</Link>
            </Button>
          </CardFooter>
        </Card> */}
      </div>

      {/* Token Information */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-[#d1ff00]" />
              About BNM Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">• Native token of the Binomena blockchain</p>
            <p className="text-sm">• Total supply: 1,000,000,000 BNM</p>
            <p className="text-sm">• Used for transaction fees and network operations</p>
            <p className="text-sm">• Secured by NodeSwift Proof-of-Stake consensus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              About PAPRD Stablecoin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">• USD-pegged stablecoin on Binomena</p>
            <p className="text-sm">• 150% collateral backing ratio</p>
            <p className="text-sm">• Smart contract with advanced controls</p>
            <p className="text-sm">• Dual collateral support (FIAT + BNM)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function BNMBalanceChecker() {
  const [checkAddress, setCheckAddress] = useState("")
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckBalance = async () => {
    if (!checkAddress) return
    
    setLoading(true)
    setError(null)
    setBalance(null)

    try {
      const result = await getWalletBalance(checkAddress)
      setBalance(result.balance)
    } catch (err: any) {
      setError("Invalid address or failed to fetch balance")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Check BNM Balance</h4>
      <div className="space-y-2">
        <Label htmlFor="bnmCheckAddress">Binomena Address</Label>
        <div className="flex gap-2">
          <Input
            id="bnmCheckAddress"
            placeholder="Enter any Binomena address"
            value={checkAddress}
            onChange={(e) => setCheckAddress(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleCheckBalance} 
            disabled={loading || !checkAddress}
            size="sm"
          >
            {loading ? "Checking..." : "Check"}
          </Button>
        </div>
      </div>

      {balance !== null && (
        <div className="p-4 bg-[#d1ff00]/10 border border-[#d1ff00]/20 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#d1ff00]">{balance.toLocaleString()} BNM</div>
            <div className="text-sm text-muted-foreground">Native Binomena tokens</div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-600">{error}</div>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        <p>💡 <strong>Tip:</strong> This same address can also hold PAPRD tokens.</p>
        <p>Use PAPRD Wallet to check PAPRD balance of the same address.</p>
      </div>
    </div>
  )
}

function TransactionFeeInfo() {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Transaction Fees</h4>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
          <span className="text-sm">BNM Transfer</span>
          <span className="font-medium text-[#d1ff00]">0.1 BNM</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
          <span className="text-sm">PAPRD Transfer</span>
          <span className="font-medium text-green-600">0.1 BNM</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
          <span className="text-sm">Smart Contract Call</span>
          <span className="font-medium text-blue-600">100 BNM</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>• All transaction fees are paid in BNM tokens</p>
        <p>• Fees support network validators</p>
        <p>• Contract deployment fees may vary</p>
      </div>
    </div>
  )
}
