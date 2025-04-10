import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, BarChart3, Code, CreditCard, Shield } from "lucide-react"
import { ApiDebug } from "@/components/api-debug"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 gradient-bg">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center text-white">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome to Binomena Blockchain
            </h1>
            <p className="max-w-[700px] text-lg md:text-xl">
              The next generation blockchain platform with fast transactions, smart contracts, and a deflationary token
              model.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/wallet/create">Create Wallet</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/explorer">Explore Blockchain</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover what makes Binomena Blockchain unique
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <Card className="card-hover">
              <CardHeader>
                <Shield className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>NodeSwift Consensus</CardTitle>
                <CardDescription>
                  Our custom Proof of Stake consensus mechanism designed for security and fast transaction validation.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <Wallet className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Binom Token (BNM)</CardTitle>
                <CardDescription>
                  Native token with a maximum supply of 1 billion and a deflationary mechanism.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <BarChart3 className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Fast Transactions</CardTitle>
                <CardDescription>Optimized for quick validation and confirmation with minimal fees.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <Code className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Smart Contracts</CardTitle>
                <CardDescription>Deploy and interact with smart contracts on the Binomena blockchain.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <CreditCard className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Buy BNM Tokens</CardTitle>
                <CardDescription>Purchase Binom tokens directly with your credit card.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <Shield className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Security Audit System</CardTitle>
                <CardDescription>Built-in security monitoring and validation for peace of mind.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <ApiDebug />
      </div>
      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join the Binomena blockchain ecosystem today
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg">
                <Link href="/wallet/create">Create a Wallet</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/docs">Read Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
