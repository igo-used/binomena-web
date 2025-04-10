import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function WalletPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Binomena Wallet</h1>
      <p className="text-lg text-muted-foreground mb-8">Manage your Binomena tokens and interact with the blockchain</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Create Wallet</CardTitle>
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
            <CardTitle>Import Wallet</CardTitle>
            <CardDescription>Import an existing wallet using private key</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Already have a wallet? Import it using your private key to access your funds.
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
            <CardTitle>Check Balance</CardTitle>
            <CardDescription>View your wallet balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Check the balance of any wallet address on the Binomena blockchain.
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
            <CardTitle>Send Tokens</CardTitle>
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
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View your transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">View all transactions associated with your wallet address.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/wallet/history">View History</Link>
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
    </div>
  )
}
