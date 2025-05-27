"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, DollarSign, Shield, Eye, EyeOff, Wallet, Send, Coins, TrendingUp, Lock, History, Plus, Import, ExternalLink, Calculator, ArrowRight } from "lucide-react"
import {
  getPAPRDTotalSupply,
  getPAPRDInfo,
  getPAPRDBalance,
  transferPAPRD,
  getCollateralRatio,
  getPAPRDOwner,
  isPAPRDPaused,
  // Removed mint/burn functions for simplified UI - admin can use terminal/API directly
  // Commented out admin functions for future use
  // addCollateral,
  // removeCollateral,
  // getCollateralBalance,
  // addMinter,
  // removeMinter,
  // blacklistAddress,
  // unblacklistAddress,
  // pauseContract,
  // unpauseContract,
  // setCollateralRatio,
  // transferOwnership,
  // isBlacklisted,
  // isMinter
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
    
    // Prevent browser extension wallet conflicts
    if (typeof window !== 'undefined') {
      // Disable any automatic wallet detection that might interfere
      window.addEventListener('error', (e) => {
        if (e.message && e.message.includes('inpage')) {
          e.preventDefault()
          console.warn('Browser wallet extension detected, ignoring to prevent conflicts')
        }
      })
    }
  }, [])

  useEffect(() => {
    if (userAddress && hasWallet) {
      fetchUserBalance()
    }
  }, [userAddress, hasWallet])

  const fetchContractInfo = async () => {
    try {
      const [infoResult, ratioResult] = await Promise.allSettled([
        getPAPRDInfo(),
        getCollateralRatio()
      ])

      if (infoResult.status === 'fulfilled') {
        const info = infoResult.value
        setTotalSupply(parseInt(info.totalSupply))
        setOwner(info.owner)
        setIsPaused(info.paused)
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

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <DollarSign className="h-16 w-16 text-primary" />
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">PAPRD Wallet</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
          Manage your PAPRD stablecoin tokens using smart contract functionality
        </p>
      </div>

      {/* BNM Wallet Alert */}
      <Alert className="mb-8">
        <Coins className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Looking for BNM token management? Use our dedicated BNM wallet.</span>
          <Button asChild variant="outline" size="sm">
            <Link href="/wallet" className="flex items-center gap-2">
              BNM Wallet <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
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

      {/* Quick PAPRD Balance Checker */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Quick PAPRD Balance Checker
          </CardTitle>
          <CardDescription>
            Check PAPRD stablecoin balance and contract info for any Binomena address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PAPRDBalanceChecker />
            <PAPRDContractInfo 
              totalSupply={totalSupply}
              collateralRatio={collateralRatio}
              isPaused={isPaused}
              owner={owner}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Connect PAPRD Wallet
            </CardTitle>
            <CardDescription>Connect your Binomena wallet for PAPRD operations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect your existing Binomena wallet to send, receive, and manage PAPRD tokens.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="#connect-wallet">Connect Wallet</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send PAPRD
            </CardTitle>
            <CardDescription>Transfer PAPRD tokens to another address</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Send PAPRD stablecoin tokens to any Binomena address using smart contract transfer.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full" disabled={!hasWallet}>
              <Link href="#send-paprd">Send PAPRD</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Check PAPRD Balance</CardTitle>
            <CardDescription>View PAPRD balance of any address</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Check the PAPRD balance of any wallet address using smart contract query.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="#balance-checker">Check Balance</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>View your PAPRD transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track all your PAPRD transfers and transactions on the blockchain.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="#paprd-history">View History</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Balance Checker
            </CardTitle>
            <CardDescription>Check PAPRD balance of any address</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Quickly check the PAPRD balance of any Binomena wallet address.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="#balance-checker">Check Balance</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              BNM Tokens
            </CardTitle>
            <CardDescription>Access BNM token wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage BNM tokens with dedicated wallet interface and blockchain functions.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/wallet">Open BNM Wallet</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Detailed Operations */}
      {hasWallet ? (
        <ConnectedWalletInterface 
          userAddress={userAddress}
          privateKey={privateKey}
          balance={balance}
          onOperation={handleOperation}
          loading={loading}
          onDisconnect={() => {
            localStorage.removeItem('wallet_address')
            localStorage.removeItem('wallet_private_key')
            localStorage.removeItem('paprd_wallet_address')
            localStorage.removeItem('paprd_wallet_private_key')
            setHasWallet(false)
            setUserAddress("")
            setPrivateKey("")
          }}
        />
      ) : (
        <WalletConnectionInterface 
          manualAddress={manualAddress}
          manualKey={manualKey}
          showPrivateKey={showPrivateKey}
          loading={loading.connectWallet}
          onAddressChange={setManualAddress}
          onKeyChange={setManualKey}
          onToggleShowKey={() => setShowPrivateKey(!showPrivateKey)}
          onConnect={handleConnectWallet}
        />
      )}

      {/* Token Information */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              About PAPRD Stablecoin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">• USD-pegged stablecoin (1:1 target)</p>
            <p className="text-sm">• Total supply: {totalSupply.toLocaleString()} PAPRD</p>
            <p className="text-sm">• Smart contract controlled with compliance features</p>
            <p className="text-sm">• {collateralRatio}% collateral backing ratio</p>
            <p className="text-sm">• Dual collateral support (FIAT + BNM)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-[#d1ff00]" />
              About BNM Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">• Native token of the Binomena blockchain</p>
            <p className="text-sm">• Used for all transaction fees</p>
            <p className="text-sm">• Required for PAPRD smart contract operations</p>
            <p className="text-sm">• Same wallet holds both BNM and PAPRD</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Component: PAPRD Balance Checker
function PAPRDBalanceChecker() {
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
      <h4 className="font-medium">Check PAPRD Balance</h4>
      <div className="space-y-2">
        <Label htmlFor="paprdCheckAddress">Binomena Address</Label>
        <div className="flex gap-2">
          <Input
            id="paprdCheckAddress"
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
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
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
        <p>💡 <strong>Tip:</strong> This same address can also hold BNM tokens.</p>
        <p>Use BNM Wallet to check BNM balance of the same address.</p>
      </div>
    </div>
  )
}

// Component: PAPRD Contract Info
interface PAPRDContractInfoProps {
  totalSupply: number
  collateralRatio: number
  isPaused: boolean
  owner: string
}

function PAPRDContractInfo({ totalSupply, collateralRatio, isPaused, owner }: PAPRDContractInfoProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">PAPRD Contract Info</h4>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
          <span className="text-sm">Total Supply</span>
          <span className="font-medium text-green-600">{totalSupply.toLocaleString()} PAPRD</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
          <span className="text-sm">Collateral Ratio</span>
          <span className="font-medium text-blue-600">{collateralRatio}%</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
          <span className="text-sm">Contract Status</span>
          <span className={`font-medium ${isPaused ? 'text-red-600' : 'text-green-600'}`}>
            {isPaused ? 'Paused' : 'Active'}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
          <span className="text-sm">Contract ID</span>
          <span className="font-medium text-xs">AdNe1e77857b790cf352e57a20c704add7ce86db6f7dc5b7d14cbea95cfffe0d</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>• PAPRD operates via smart contract</p>
        <p>• All operations require BNM for gas fees</p>
        <p>• 25+ contract functions available</p>
      </div>
    </div>
  )
}

// Component: Wallet Connection Interface
interface WalletConnectionInterfaceProps {
  manualAddress: string
  manualKey: string
  showPrivateKey: boolean
  loading: boolean
  onAddressChange: (address: string) => void
  onKeyChange: (key: string) => void
  onToggleShowKey: () => void
  onConnect: () => void
}

function WalletConnectionInterface({
  manualAddress,
  manualKey,
  showPrivateKey,
  loading,
  onAddressChange,
  onKeyChange,
  onToggleShowKey,
  onConnect
}: WalletConnectionInterfaceProps) {
  return (
    <div id="connect-wallet" className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Connect Your Binomena Wallet</h2>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important: Blockchain Wallet Required</AlertTitle>
        <AlertDescription>
          PAPRD tokens exist on the Binomena blockchain. You need a Binomena wallet (not a token-specific wallet) to manage PAPRD tokens.
          The same wallet that holds BNM tokens can also hold PAPRD tokens.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              onChange={(e) => onAddressChange(e.target.value)}
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
                onChange={(e) => onKeyChange(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={onToggleShowKey}
              >
                {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Button 
            onClick={onConnect} 
            disabled={loading || !manualAddress || !manualKey}
            className="w-full"
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Component: Connected Wallet Interface
interface ConnectedWalletInterfaceProps {
  userAddress: string
  privateKey: string
  balance: number
  onOperation: (operation: string, fn: () => Promise<any>) => void
  loading: { [key: string]: boolean }
  onDisconnect: () => void
}

function ConnectedWalletInterface({
  userAddress,
  privateKey,
  balance,
  onOperation,
  loading,
  onDisconnect
}: ConnectedWalletInterfaceProps) {
  return (
    <div className="space-y-8">
      {/* Wallet Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Binomena Wallet</CardTitle>
          <CardDescription>Your blockchain wallet managing PAPRD tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="font-medium">Your PAPRD Balance</div>
              <div className="text-2xl font-bold text-green-600">{balance.toLocaleString()} PAPRD</div>
              <div className="text-xs text-muted-foreground">≈ ${balance.toLocaleString()} USD</div>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
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
            <Button variant="outline" onClick={onDisconnect}>
              Disconnect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Operations Tabs */}
      <Tabs defaultValue="send" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger value="receive">Receive</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Send Tab */}
        <TabsContent value="send" className="space-y-4" id="send-paprd">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send PAPRD
              </CardTitle>
              <CardDescription>Transfer PAPRD tokens to another address using smart contract</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TransferForm 
                onTransfer={(to, amount) => 
                  onOperation('transfer', () => transferPAPRD(to, amount, privateKey, userAddress))
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

            <Card id="balance-checker">
              <CardHeader>
                <CardTitle>Check Any PAPRD Balance</CardTitle>
                <CardDescription>Check PAPRD balance of any Binomena address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PAPRDBalanceChecker />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4" id="paprd-history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                PAPRD Transaction History
              </CardTitle>
              <CardDescription>Your PAPRD smart contract transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Transaction history coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  View all your PAPRD transfers, mints, burns, and smart contract interactions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// All the form components remain the same as before...
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
      // Validate amount is a positive integer
      const numAmount = parseFloat(amount)
      if (isNaN(numAmount) || numAmount <= 0) {
        alert("Please enter a valid positive amount")
        return
      }
      if (numAmount > maxAmount) {
        alert(`Amount cannot exceed your balance of ${maxAmount} PAPRD`)
        return
      }
      
      console.log("Form submitting with:", { to, amount: numAmount, maxAmount })
      onTransfer(to, numAmount)
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
          name="transferTo"
          placeholder="Enter recipient address"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="transferAmount">Amount (PAPRD)</Label>
        <Input
          id="transferAmount"
          name="transferAmount"
          type="number"
          step="0.000001"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          max={maxAmount}
          required
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

// REMOVED ADMIN COMPONENTS TO FIX LINTER ERRORS
// CollateralForm and AdminPanel components removed since admin functions are not available
// These will be re-added when the API endpoints are implemented 