import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileCode, List, PlusCircle } from "lucide-react"

export default function ContractsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Smart Contracts</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Deploy and interact with smart contracts on the Binomena blockchain
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="card-hover">
          <CardHeader>
            <Upload className="w-10 h-10 text-blue-600 mb-2" />
            <CardTitle>Deploy Contract</CardTitle>
            <CardDescription>Upload and deploy a new smart contract to the blockchain</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/contracts/deploy">Deploy Contract</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <List className="w-10 h-10 text-blue-600 mb-2" />
            <CardTitle>My Contracts</CardTitle>
            <CardDescription>View and manage your deployed smart contracts</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/contracts/list">View Contracts</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <FileCode className="w-10 h-10 text-blue-600 mb-2" />
            <CardTitle>Contract Templates</CardTitle>
            <CardDescription>Browse and use pre-built smart contract templates</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/contracts/templates">Browse Templates</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Smart Contract Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Smart contracts on Binomena are written in WebAssembly (WASM) and can be developed using languages like
                Rust, AssemblyScript, or C/C++.
              </p>
              <p>To deploy a smart contract, you'll need:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A compiled WASM binary of your contract</li>
                <li>A Binomena wallet with sufficient BNM tokens</li>
                <li>A contract ABI (Application Binary Interface) file</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Development Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We recommend the following tools for developing Binomena smart contracts:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Binomena SDK - Our official development kit</li>
                <li>Rust with wasm-pack - For Rust developers</li>
                <li>AssemblyScript - TypeScript-like syntax for WebAssembly</li>
                <li>Binomena CLI - Command-line tools for testing and deployment</li>
              </ul>
              <Button asChild variant="outline" className="mt-2">
                <Link href="/docs/smart-contracts">Read Documentation</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Smart Contract Development Process</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 pl-6 list-decimal">
              <li>
                <strong>Write your contract</strong> - Develop your smart contract using Rust, AssemblyScript, or
                another WASM-compatible language.
              </li>
              <li>
                <strong>Compile to WASM</strong> - Compile your contract to a WebAssembly binary file.
              </li>
              <li>
                <strong>Test locally</strong> - Use the Binomena CLI to test your contract in a local environment.
              </li>
              <li>
                <strong>Deploy to testnet</strong> - Deploy your contract to the Binomena testnet for further testing.
              </li>
              <li>
                <strong>Deploy to mainnet</strong> - Once thoroughly tested, deploy your contract to the Binomena
                mainnet.
              </li>
              <li>
                <strong>Interact with your contract</strong> - Use the Binomena SDK or our web interface to interact
                with your deployed contract.
              </li>
            </ol>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/contracts/deploy">
                <PlusCircle className="mr-2 h-4 w-4" />
                Deploy Your First Contract
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
