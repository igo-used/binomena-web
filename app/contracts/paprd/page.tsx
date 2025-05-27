"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DollarSign, ArrowRight, AlertCircle } from "lucide-react"

export default function PAPRDRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/wallet/paprd')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <DollarSign className="h-16 w-16 text-primary" />
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">PAPRD Stablecoin</h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            PAPRD management has moved to the dedicated wallet interface
          </p>
        </div>

        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Page Moved</AlertTitle>
          <AlertDescription>
            PAPRD stablecoin management has been moved to the dedicated PAPRD wallet for a better user experience.
            You'll be automatically redirected in 5 seconds.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              New PAPRD Wallet Interface
            </CardTitle>
            <CardDescription>
              Enhanced wallet experience with dedicated PAPRD management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">What's New:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Dedicated wallet creation and import for PAPRD</li>
                <li>• Integrated balance and transaction management</li>
                <li>• Streamlined send and receive functionality</li>
                <li>• Complete mint, burn, and collateral operations</li>
                <li>• Advanced admin controls and address verification</li>
                <li>• Real-time contract status monitoring</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href="/wallet/paprd" className="flex items-center gap-2">
                  Go to PAPRD Wallet <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contracts">Back to Contracts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About PAPRD Stablecoin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Key Features:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• USD-pegged stablecoin</li>
                  <li>• 150% collateral backing</li>
                  <li>• Smart contract controls</li>
                  <li>• Compliance features</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Contract Details:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Total Supply: 100M PAPRD</li>
                  <li>• Dual collateral support</li>
                  <li>• Minter permissions</li>
                  <li>• Blacklist protection</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 