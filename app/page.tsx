import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Coins, DollarSign, Blocks, ArrowRight, CheckCircle, Search, Send, Plus } from "lucide-react"
import { ApiDebug } from "@/components/api-debug"

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-[#d1ff00] to-green-500 text-transparent bg-clip-text">
                  Binomena Blockchain
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Fast, secure, and user-friendly blockchain with dual token ecosystem. 
                Manage BNM tokens and PAPRD stablecoin with dedicated interfaces.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-[#d1ff00] text-black hover:bg-lime-300">
                <Link href="/wallet">
                  <Coins className="mr-2 h-4 w-4" />
                  BNM Wallet
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/wallet/paprd">
                  <DollarSign className="mr-2 h-4 w-4" />
                  PAPRD Wallet
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Easy Interface Explanation */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simple & Clear Interfaces
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg mt-4">
              No confusion - use the right interface for the right token. One Binomena wallet works with both.
            </p>
          </div>

          <Alert className="mb-8 max-w-4xl mx-auto">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-center">
              <strong>Key Concept:</strong> You have ONE Binomena wallet address that can hold both BNM and PAPRD tokens. 
              Use different interfaces to manage different tokens easily.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* BNM Wallet Interface */}
            <Card className="border-[#d1ff00]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-6 w-6 text-[#d1ff00]" />
                    BNM Wallet Interface
                  </CardTitle>
                  <Badge variant="outline" className="border-[#d1ff00] text-[#d1ff00]">Native Token</Badge>
                </div>
                <CardDescription>
                  For managing Binomena (BNM) tokens - the native currency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Search className="h-4 w-4 text-[#d1ff00]" />
                    <span>Check BNM balances of any address</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Send className="h-4 w-4 text-[#d1ff00]" />
                    <span>Send/receive BNM tokens</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="h-4 w-4 text-[#d1ff00]" />
                    <span>View transaction fees (all fees paid in BNM)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Plus className="h-4 w-4 text-[#d1ff00]" />
                    <span>Create/import Binomena wallets</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-[#d1ff00] text-black hover:bg-lime-300">
                  <Link href="/wallet">
                    Use BNM Wallet <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* PAPRD Wallet Interface */}
            <Card className="border-green-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-green-500" />
                    PAPRD Wallet Interface
                  </CardTitle>
                  <Badge variant="outline" className="border-green-500 text-green-500">Stablecoin</Badge>
                </div>
                <CardDescription>
                  For managing PAPRD stablecoin tokens - USD-pegged value
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Search className="h-4 w-4 text-green-500" />
                    <span>Check PAPRD balances of any address</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Send className="h-4 w-4 text-green-500" />
                    <span>Send/receive PAPRD tokens</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span>Mint/burn PAPRD (if authorized)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Plus className="h-4 w-4 text-green-500" />
                    <span>Manage collateral & admin functions</span>
                  </div>
                </div>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/wallet/paprd">
                    Use PAPRD Wallet <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Use Cases */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Common Use Cases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#d1ff00]">
                    "I want to check my BNM tokens"
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Go to <strong>BNM Wallet</strong> → Enter your address in the balance checker
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/wallet">Go to BNM Wallet</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">
                    "I want to check my PAPRD tokens"
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Go to <strong>PAPRD Wallet</strong> → Enter your address in the balance checker
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/wallet/paprd">Go to PAPRD Wallet</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#d1ff00]">
                    "I want to send BNM to someone"
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Go to <strong>BNM Wallet</strong> → Connect your wallet → Use send function
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/wallet/send">Send BNM</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">
                    "I want to send PAPRD to someone"
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Go to <strong>PAPRD Wallet</strong> → Connect your wallet → Use send function
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/wallet/paprd">Send PAPRD</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <Coins className="w-10 h-10 text-[#d1ff00] mb-2" />
                <CardTitle>BNM Token</CardTitle>
                <CardDescription>Native blockchain currency</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 1 billion total supply</li>
                  <li>• Used for transaction fees</li>
                  <li>• Proof-of-Stake consensus</li>
                  <li>• Fast & low-cost transfers</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <DollarSign className="w-10 h-10 text-green-500 mb-2" />
                <CardTitle>PAPRD Stablecoin</CardTitle>
                <CardDescription>USD-pegged stable value</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 1:1 USD peg target</li>
                  <li>• 150% collateral backing</li>
                  <li>• Smart contract controlled</li>
                  <li>• Compliance features</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <Blocks className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Smart Contracts</CardTitle>
                <CardDescription>WebAssembly powered</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Deploy WASM contracts</li>
                  <li>• Rust/AssemblyScript support</li>
                  <li>• Gas-efficient execution</li>
                  <li>• Full-featured runtime</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            <Button asChild>
              <Link href="/explorer">
                Explore Blockchain <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* API Debug */}
      <div className="container mx-auto py-8">
        <ApiDebug />
      </div>
    </div>
  )
}
