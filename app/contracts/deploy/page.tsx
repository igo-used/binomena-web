"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, Upload, Eye, EyeOff } from "lucide-react"
import { deployContract } from "@/lib/api"
import Link from "next/link"

export default function DeployContractPage() {
  const [contractName, setContractName] = useState("")
  const [ownerAddress, setOwnerAddress] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [wasmFile, setWasmFile] = useState<File | null>(null)
  const [wasmCode, setWasmCode] = useState("")
  const [fee, setFee] = useState("100")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<any | null>(null)
  const [showPrivateKey, setShowPrivateKey] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.name.endsWith('.wasm')) {
      setWasmFile(file)
      
      // Convert file to base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const uint8Array = new Uint8Array(arrayBuffer)
        const base64String = btoa(String.fromCharCode(...uint8Array))
        setWasmCode(base64String)
      }
      reader.readAsArrayBuffer(file)
    } else {
      setError("Please select a valid WASM file (.wasm)")
    }
  }

  const handleDeploy = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (!contractName || !ownerAddress || !privateKey || !wasmCode) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    try {
      const result = await deployContract(
        ownerAddress,
        contractName,
        wasmCode,
        privateKey,
        parseInt(fee)
      )
      
      setSuccess(result)
      console.log("Contract deployed successfully:", result)
    } catch (err: any) {
      setError(err.message || "Failed to deploy contract")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Deploy Smart Contract</h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Deploy a WebAssembly smart contract to the Binomena blockchain
          </p>
        </div>

        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6" variant="default">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Contract Deployed Successfully!</AlertTitle>
            <AlertDescription>
              <div className="space-y-2 mt-2">
                <div><strong>Contract ID:</strong> {success.contractId || success.id}</div>
                <div><strong>Address:</strong> {success.address}</div>
                <div><strong>Name:</strong> {success.name}</div>
                <div className="pt-2">
                  <Link href={`/contracts/list`}>
                    <Button variant="outline" size="sm">View Deployed Contracts</Button>
                  </Link>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
            <CardDescription>
              Upload your WebAssembly contract and configure deployment settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contractName">Contract Name</Label>
              <Input
                id="contractName"
                placeholder="My Smart Contract"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerAddress">Owner Address</Label>
              <Input
                id="ownerAddress"
                placeholder="Your wallet address"
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="privateKey">Private Key</Label>
              <div className="relative">
                <Input
                  id="privateKey"
                  type={showPrivateKey ? "text" : "password"}
                  placeholder="Your private key for signing"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                >
                  {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee">Deployment Fee (BNM)</Label>
              <Input
                id="fee"
                type="number"
                placeholder="100"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wasmFile">WASM Contract File</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <div className="space-y-2">
                  <Input
                    id="wasmFile"
                    type="file"
                    accept=".wasm"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Label htmlFor="wasmFile" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>Choose WASM File</span>
                    </Button>
                  </Label>
                  {wasmFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {wasmFile.name} ({(wasmFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleDeploy} 
                disabled={loading || !wasmCode}
                className="w-full"
              >
                {loading ? "Deploying Contract..." : "Deploy Contract"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Development Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Supported Languages</h4>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Rust (recommended) - Use wasm-pack for compilation</li>
                <li>AssemblyScript - TypeScript-like syntax</li>
                <li>C/C++ - Use Emscripten toolchain</li>
                <li>Go - Experimental WASM support</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Compilation Example (Rust)</h4>
              <Textarea
                readOnly
                value={`# Add to Cargo.toml
[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"

# Build command
cargo build --target wasm32-unknown-unknown --release`}
                className="font-mono text-xs"
                rows={8}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 