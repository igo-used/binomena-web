"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, DollarSign, Shield, Eye, EyeOff, Wallet, Send, Coins, TrendingUp, Lock, History, Plus, Import, ExternalLink } from "lucide-react"
import {
  getPAPRDTotalSupply,
  getPAPRDBalance,
  transferPAPRD,
  mintPAPRD,
  burnPAPRD,
  addCollateral,
  removeCollateral,
  getCollateralBalance,
  getCollateralRatio,
  addMinter,
  removeMinter,
  blacklistAddress,
  unblacklistAddress,
  pauseContract,
  unpauseContract,
  setCollateralRatio,
  transferOwnership,
  getPAPRDOwner,
  isPAPRDPaused,
  isBlacklisted,
  isMinter
} from "@/lib/api"
import Link from "next/link"

export default function PAPRDWalletPage() {
  // Wallet state
  const [hasWallet, setHasWallet] = useState(false)
  const [userAddress, setUserAddress] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  
  // PAPRD contract state
  const [totalSupply, setTotalSupply] = useState<number>(0)
  const [owner, setOwner] = useState<string>("")
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [collateralRatio, setCurrentCollateralRatio] = useState<number>(150)
  const [balance, setBalance] = useState<number>(0)
  
  // UI state
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Manual wallet input state
  const [manualAddress, setManualAddress] = useState("")
  const [manualKey, setManualKey] = useState("")

  useEffect(() => {
    // Check if wallet exists in localStorage (try both BNM and PAPRD keys)
    const savedBNMAddress = localStorage.getItem('wallet_address')
    const savedBNMKey = localStorage.getItem('wallet_private_key')
    const savedPAPRDAddress = localStorage.getItem('paprd_wallet_address')
    const savedPAPRDKey = localStorage.getItem('paprd_wallet_private_key')
    
    // Prefer BNM wallet (since it's the blockchain wallet)
    if (savedBNMAddress && savedBNMKey) {
      setUserAddress(savedBNMAddress)
      setPrivateKey(savedBNMKey)
      setHasWallet(true)
    } else if (savedPAPRDAddress && savedPAPRDKey) {
      setUserAddress(savedPAPRDAddress)
      setPrivateKey(savedPAPRDKey)
      setHasWallet(true)
    }
    
    fetchContractInfo()
  }, [])

  useEffect(() => {
    if (userAddress && hasWallet) {
      fetchUserBalance()
    }
  }, [userAddress, hasWallet])

  const fetchContractInfo = async () => {
    try {
      const [supplyResult, ownerResult, pausedResult, ratioResult] = await Promise.allSettled([
        getPAPRDTotalSupply(),
        getPAPRDOwner(),
        isPAPRDPaused(),
        getCollateralRatio()
      ])

      if (supplyResult.status === 'fulfilled') {
        setTotalSupply(supplyResult.value.totalSupply)
      }
      if (ownerResult.status === 'fulfilled') {
        setOwner(ownerResult.value.owner)
      }
      if (pausedResult.status === 'fulfilled') {
        setIsPaused(pausedResult.value.paused)
      }
      if (ratioResult.status === 'fulfilled') {
        setCurrentCollateralRatio(ratioResult.value.ratio)
      }
    } catch (err) {
      console.error("Error fetching contract info:", err)
    }
  }

  const fetchUserBalance = async () => {
    if (!userAddress) return
    
    try {
      const result = await getPAPRDBalance(userAddress)
      setBalance(result.balance)
    } catch (err) {
      console.error("Error fetching PAPRD balance:", err)
    }
  }

  const handleConnectWallet = async () => {
    if (!manualAddress || !manualKey) {
      setError("Please enter both wallet address and private key")
      return
    }

    setLoading({ ...loading, connectWallet: true })
    setError(null)
    setSuccess(null)

    try {
      // Validate the wallet by trying to fetch PAPRD balance
      await getPAPRDBalance(manualAddress)
      
      setUserAddress(manualAddress)
      setPrivateKey(manualKey)
      setHasWallet(true)
      
      // Save to localStorage (use standard wallet keys, not PAPRD-specific)
      localStorage.setItem('wallet_address', manualAddress)
      localStorage.setItem('wallet_private_key', manualKey)
      
      setSuccess("Wallet connected successfully!")
      setManualAddress("")
      setManualKey("")
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
    } finally {
      setLoading({ ...loading, connectWallet: false })
    }
  }

  const handleOperation = async (operation: string, fn: () => Promise<any>) => {
    setLoading({ ...loading, [operation]: true })
    setError(null)
    setSuccess(null)

    try {
      const result = await fn()
      setSuccess(`${operation} completed successfully! ${result.txId ? `TX: ${result.txId}` : ''}`)
      
      // Refresh data after successful operations
      await fetchContractInfo()
      if (userAddress) await fetchUserBalance()
    } catch (err: any) {
      setError(err.message || `Failed to ${operation}`)
    } finally {
      setLoading({ ...loading, [operation]: false })
    }
  }

  if (!hasWallet) {
    return (
      <div className="container py-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <DollarSign className="h-16 w-16 text-primary" />
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">PAPRD Wallet</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Connect your Binomena wallet to manage PAPRD stablecoin tokens
            </p>
          </div>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important: Blockchain Wallet Required</AlertTitle>
            <AlertDescription>
              PAPRD tokens exist on the Binomena blockchain. You need a Binomena wallet (not a token-specific wallet) to manage PAPRD tokens.
              The same wallet that holds BNM tokens can also hold PAPRD tokens.
            </AlertDescription>
          </Alert>

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
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="card-hover">
              <CardHeader>
                <Coins className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Use Existing BNM Wallet</CardTitle>
                <CardDescription>If you already have a BNM wallet, use it for PAPRD</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your existing Binomena (BNM) wallet can hold both BNM and PAPRD tokens. No need to create a separate wallet.
                </p>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/wallet" className="flex items-center gap-2">
                    Go to BNM Wallet <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <Wallet className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Create New Binomena Wallet</CardTitle>
                <CardDescription>Create a new blockchain wallet for both tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create a new Binomena blockchain wallet that can hold both BNM and PAPRD tokens.
                </p>
                <Button asChild className="w-full">
                  <Link href="/wallet/create" className="flex items-center gap-2">
                    Create Binomena Wallet <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Manual Wallet Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Import className="h-5 w-5" />
                Connect Existing Wallet
              </CardTitle>
              <CardDescription>Connect your existing Binomena wallet manually</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manualAddress">Wallet Address</Label>
                <Input
                  id="manualAddress"
                  placeholder="Enter your Binomena wallet address"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manualKey">Private Key</Label>
                <div className="relative">
                  <Input
                    id="manualKey"
                    type={showPrivateKey ? "text" : "password"}
                    placeholder="Enter your private key"
                    value={manualKey}
                    onChange={(e) => setManualKey(e.target.value)}
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
              <Button 
                onClick={handleConnectWallet} 
                disabled={loading.connectWallet || !manualAddress || !manualKey}
                className="w-full"
              >
                {loading.connectWallet ? "Connecting..." : "Connect Wallet"}
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>About Binomena Wallets & PAPRD</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• <strong>One Wallet, Multiple Tokens:</strong> Your Binomena wallet can hold both BNM and PAPRD tokens</li>
                <li>• <strong>Blockchain-Level Security:</strong> Wallet creation happens at the blockchain level, not per token</li>
                <li>• <strong>Universal Address:</strong> The same address works for all tokens on Binomena</li>
                <li>• <strong>Shared Private Key:</strong> One private key manages all your tokens on the blockchain</li>
                <li>• <strong>Cross-Token Compatibility:</strong> Switch between BNM and PAPRD interfaces seamlessly</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <DollarSign className="h-16 w-16 text-primary" />
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">PAPRD Wallet</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
          Manage your PAPRD stablecoin tokens on Binomena blockchain
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
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Your PAPRD Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balance.toLocaleString()} PAPRD</div>
            <p className="text-xs text-muted-foreground">≈ ${balance.toLocaleString()} USD</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSupply.toLocaleString()} PAPRD</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Collateral Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collateralRatio}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isPaused ? 'text-red-500' : 'text-green-500'}`}>
              {isPaused ? 'Paused' : 'Active'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Connected Binomena Wallet</CardTitle>
          <CardDescription>Your blockchain wallet managing PAPRD tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Wallet Address</Label>
            <div className="font-mono text-xs text-muted-foreground break-all p-2 bg-muted rounded">
              {userAddress}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/wallet">Switch to BNM View</Link>
            </Button>
            <Button variant="outline" onClick={() => {
              localStorage.removeItem('wallet_address')
              localStorage.removeItem('wallet_private_key')
              localStorage.removeItem('paprd_wallet_address')
              localStorage.removeItem('paprd_wallet_private_key')
              setHasWallet(false)
              setUserAddress("")
              setPrivateKey("")
            }}>
              Disconnect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Operations Tabs */}
      <Tabs defaultValue="send" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger value="receive">Receive</TabsTrigger>
          <TabsTrigger value="mint">Mint/Burn</TabsTrigger>
          <TabsTrigger value="collateral">Collateral</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Send Tab */}
        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send PAPRD
              </CardTitle>
              <CardDescription>Transfer PAPRD tokens to another address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TransferForm 
                onTransfer={(to, amount) => 
                  handleOperation('transfer', () => transferPAPRD(to, amount, privateKey))
                }
                loading={loading.transfer}
                disabled={!privateKey}
                maxAmount={balance}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receive Tab */}
        <TabsContent value="receive" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Receive PAPRD</CardTitle>
                <CardDescription>Share your address to receive PAPRD tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="mx-auto bg-white p-4 rounded-lg max-w-xs">
                    {/* QR Code placeholder */}
                    <div className="w-full h-48 bg-muted rounded flex items-center justify-center">
                      <span className="text-muted-foreground">QR Code</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Your Binomena Address (works for all tokens)</Label>
                    <div className="font-mono text-xs text-muted-foreground break-all p-2 bg-muted rounded">
                      {userAddress}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => navigator.clipboard.writeText(userAddress)}
                      className="w-full"
                    >
                      Copy Address
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Check Any PAPRD Balance</CardTitle>
                <CardDescription>Check PAPRD balance of any Binomena address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <BalanceChecker />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mint/Burn Tab */}
        <TabsContent value="mint" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Mint PAPRD
                </CardTitle>
                <CardDescription>Create new PAPRD tokens (minter only)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <MintForm 
                  onMint={(to, amount) => 
                    handleOperation('mint', () => mintPAPRD(to, amount, privateKey))
                  }
                  loading={loading.mint}
                  disabled={!privateKey}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Burn PAPRD</CardTitle>
                <CardDescription>Destroy PAPRD tokens from your balance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <BurnForm 
                  onBurn={(amount) => 
                    handleOperation('burn', () => burnPAPRD(amount, privateKey))
                  }
                  loading={loading.burn}
                  disabled={!privateKey}
                  maxAmount={balance}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Collateral Tab */}
        <TabsContent value="collateral" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Collateral</CardTitle>
                <CardDescription>Increase your collateral position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CollateralForm 
                  type="add"
                  onSubmit={(amount: number, collateralType?: number) => 
                    handleOperation('addCollateral', () => addCollateral(amount, collateralType || 0, privateKey))
                  }
                  loading={loading.addCollateral}
                  disabled={!privateKey}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Remove Collateral</CardTitle>
                <CardDescription>Withdraw collateral from your position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CollateralForm 
                  type="remove"
                  onSubmit={(amount: number) => 
                    handleOperation('removeCollateral', () => removeCollateral(amount, privateKey))
                  }
                  loading={loading.removeCollateral}
                  disabled={!privateKey}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Admin Tab */}
        <TabsContent value="admin" className="space-y-4">
          <AdminPanel 
            onOperation={handleOperation}
            loading={loading}
            privateKey={privateKey}
            currentRatio={collateralRatio}
            isPaused={isPaused}
            userAddress={userAddress}
          />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>Your PAPRD transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Transaction history coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  View all your PAPRD transfers, mints, and burns
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Component Forms (same as before but optimized for wallet UI)
interface TransferFormProps {
  onTransfer: (to: string, amount: number) => void
  loading: boolean
  disabled: boolean
  maxAmount: number
}

function TransferForm({ onTransfer, loading, disabled, maxAmount }: TransferFormProps) {
  const [to, setTo] = useState("")
  const [amount, setAmount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (to && amount) {
      onTransfer(to, parseFloat(amount))
      setTo("")
      setAmount("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="transferTo">Recipient Address</Label>
        <Input
          id="transferTo"
          placeholder="Enter recipient address"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="transferAmount">Amount (PAPRD)</Label>
        <Input
          id="transferAmount"
          type="number"
          step="0.000001"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          max={maxAmount}
        />
        <p className="text-xs text-muted-foreground">
          Available: {maxAmount.toLocaleString()} PAPRD
        </p>
      </div>
      <Button type="submit" disabled={loading || disabled || !to || !amount} className="w-full">
        {loading ? "Sending..." : "Send PAPRD"}
      </Button>
    </form>
  )
}

interface MintFormProps {
  onMint: (to: string, amount: number) => void
  loading: boolean
  disabled: boolean
}

function MintForm({ onMint, loading, disabled }: MintFormProps) {
  const [to, setTo] = useState("")
  const [amount, setAmount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (to && amount) {
      onMint(to, parseFloat(amount))
      setTo("")
      setAmount("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mintTo">Recipient Address</Label>
        <Input
          id="mintTo"
          placeholder="Enter recipient address"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mintAmount">Amount (PAPRD)</Label>
        <Input
          id="mintAmount"
          type="number"
          step="0.000001"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading || disabled || !to || !amount} className="w-full">
        {loading ? "Minting..." : "Mint PAPRD"}
      </Button>
    </form>
  )
}

interface BurnFormProps {
  onBurn: (amount: number) => void
  loading: boolean
  disabled: boolean
  maxAmount: number
}

function BurnForm({ onBurn, loading, disabled, maxAmount }: BurnFormProps) {
  const [amount, setAmount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (amount) {
      onBurn(parseFloat(amount))
      setAmount("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="burnAmount">Amount (PAPRD)</Label>
        <Input
          id="burnAmount"
          type="number"
          step="0.000001"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          max={maxAmount}
        />
        <p className="text-xs text-muted-foreground">
          Max available: {maxAmount.toLocaleString()} PAPRD
        </p>
      </div>
      <Button type="submit" disabled={loading || disabled || !amount} className="w-full">
        {loading ? "Burning..." : "Burn PAPRD"}
      </Button>
    </form>
  )
}

interface CollateralFormProps {
  type: "add" | "remove"
  onSubmit: (amount: number, collateralType?: number) => void
  loading: boolean
  disabled: boolean
}

function CollateralForm({ type, onSubmit, loading, disabled }: CollateralFormProps) {
  const [amount, setAmount] = useState("")
  const [collateralType, setCollateralType] = useState("0")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (amount) {
      if (type === "add") {
        onSubmit(parseFloat(amount), parseInt(collateralType))
      } else {
        onSubmit(parseFloat(amount))
      }
      setAmount("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="collateralAmount">Amount</Label>
        <Input
          id="collateralAmount"
          type="number"
          step="0.000001"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      {type === "add" && (
        <div className="space-y-2">
          <Label htmlFor="collateralType">Collateral Type</Label>
          <select
            id="collateralType"
            value={collateralType}
            onChange={(e) => setCollateralType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="0">FIAT</option>
            <option value="1">BNM</option>
          </select>
        </div>
      )}
      <Button type="submit" disabled={loading || disabled || !amount} className="w-full">
        {loading ? `${type === "add" ? "Adding" : "Removing"}...` : `${type === "add" ? "Add" : "Remove"} Collateral`}
      </Button>
    </form>
  )
}

interface AdminPanelProps {
  onOperation: (operation: string, fn: () => Promise<any>) => void
  loading: { [key: string]: boolean }
  privateKey: string
  currentRatio: number
  isPaused: boolean
  userAddress: string
}

function BalanceChecker() {
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
      const result = await getPAPRDBalance(checkAddress)
      setBalance(result.balance)
    } catch (err: any) {
      setError("Invalid address or failed to fetch balance")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="checkAddress">Binomena Address</Label>
        <div className="flex gap-2">
          <Input
            id="checkAddress"
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
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{balance.toLocaleString()} PAPRD</div>
            <div className="text-sm text-muted-foreground">≈ ${balance.toLocaleString()} USD</div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-600">{error}</div>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        <p>💡 <strong>Tip:</strong> Any Binomena address can hold both BNM and PAPRD tokens.</p>
        <p>Use BNM Wallet to check BNM balances of the same address.</p>
      </div>
    </div>
  )
}

function AdminPanel({ onOperation, loading, privateKey, currentRatio, isPaused, userAddress }: AdminPanelProps) {
  const [targetAddress, setTargetAddress] = useState("")
  const [newRatio, setNewRatio] = useState(currentRatio.toString())
  const [newOwner, setNewOwner] = useState("")
  const [checkAddress, setCheckAddress] = useState(userAddress)
  const [results, setResults] = useState<any>({})
  const [checking, setChecking] = useState(false)

  const checkAll = async () => {
    if (!checkAddress) return
    
    setChecking(true)
    try {
      const [blacklisted, minter] = await Promise.allSettled([
        isBlacklisted(checkAddress),
        isMinter(checkAddress)
      ])

      setResults({
        blacklisted: blacklisted.status === 'fulfilled' ? blacklisted.value.blacklisted : 'Error',
        minter: minter.status === 'fulfilled' ? minter.value.minter : 'Error'
      })
    } catch (err) {
      console.error("Error checking address:", err)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Address Check */}
      <Card>
        <CardHeader>
          <CardTitle>Address Verification</CardTitle>
          <CardDescription>Check address status and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter address to check"
              value={checkAddress}
              onChange={(e) => setCheckAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={checkAll} disabled={checking || !checkAddress}>
              {checking ? "Checking..." : "Check"}
            </Button>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span>Blacklisted:</span>
                <span className={results.blacklisted ? 'text-red-500' : 'text-green-500'}>
                  {results.blacklisted ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Minter:</span>
                <span className={results.minter ? 'text-green-500' : 'text-gray-500'}>
                  {results.minter ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Functions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Minter Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minterAddress">Address</Label>
              <Input
                id="minterAddress"
                placeholder="Enter address"
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => onOperation('addMinter', () => addMinter(targetAddress, privateKey))}
                disabled={loading.addMinter || !privateKey || !targetAddress}
                className="flex-1"
              >
                {loading.addMinter ? "Adding..." : "Add Minter"}
              </Button>
              <Button 
                onClick={() => onOperation('removeMinter', () => removeMinter(targetAddress, privateKey))}
                disabled={loading.removeMinter || !privateKey || !targetAddress}
                variant="outline"
                className="flex-1"
              >
                {loading.removeMinter ? "Removing..." : "Remove Minter"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Blacklist Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blacklistAddress">Address</Label>
              <Input
                id="blacklistAddress"
                placeholder="Enter address"
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => onOperation('blacklist', () => blacklistAddress(targetAddress, privateKey))}
                disabled={loading.blacklist || !privateKey || !targetAddress}
                variant="destructive"
                className="flex-1"
              >
                {loading.blacklist ? "Blacklisting..." : "Blacklist"}
              </Button>
              <Button 
                onClick={() => onOperation('unblacklist', () => unblacklistAddress(targetAddress, privateKey))}
                disabled={loading.unblacklist || !privateKey || !targetAddress}
                variant="outline"
                className="flex-1"
              >
                {loading.unblacklist ? "Unblacklisting..." : "Unblacklist"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Contract Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newRatio">Collateral Ratio (%)</Label>
              <Input
                id="newRatio"
                type="number"
                placeholder="150"
                value={newRatio}
                onChange={(e) => setNewRatio(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => onOperation('setRatio', () => setCollateralRatio(parseFloat(newRatio), privateKey))}
              disabled={loading.setRatio || !privateKey || !newRatio}
              className="w-full"
            >
              {loading.setRatio ? "Updating..." : "Set Collateral Ratio"}
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => onOperation('pause', () => pauseContract(privateKey))}
                disabled={loading.pause || !privateKey || isPaused}
                variant="destructive"
                className="flex-1"
              >
                {loading.pause ? "Pausing..." : "Pause"}
              </Button>
              <Button 
                onClick={() => onOperation('unpause', () => unpauseContract(privateKey))}
                disabled={loading.unpause || !privateKey || !isPaused}
                variant="outline"
                className="flex-1"
              >
                {loading.unpause ? "Unpausing..." : "Unpause"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transfer Ownership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newOwner">New Owner Address</Label>
              <Input
                id="newOwner"
                placeholder="Enter new owner address"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => onOperation('transferOwnership', () => transferOwnership(newOwner, privateKey))}
              disabled={loading.transferOwnership || !privateKey || !newOwner}
              variant="destructive"
              className="w-full"
            >
              {loading.transferOwnership ? "Transferring..." : "Transfer Ownership"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 