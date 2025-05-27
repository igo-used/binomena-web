const API_BASE_URL = process.env.NEXT_PUBLIC_BLOCKCHAIN_API_URL || "https://binomena-node.onrender.com"

export interface Wallet {
  address: string
  privateKey: string
}

export interface Transaction {
  id: string
  from: string
  to: string
  amount: number
  timestamp: number
  signature: string
}

export interface Block {
  index: number
  previousHash: string
  timestamp: number
  data: Transaction[]
  hash: string
  validator: string
  signature: string
}

export interface BlockchainStatus {
  nodeId: string
  status: string
  blocks: number
  peers: number
  wallets: number
  tokenSupply: number
}

export interface WalletBalance {
  address: string
  balance: number
}

// Smart Contract Interfaces
export interface SmartContract {
  contractId: string
  owner: string
  name: string
  address: string
  createdAt: number
  status: string
}

export interface ContractFunction {
  name: string
  inputs: Array<{ name: string; type: string }>
  outputs: Array<{ name: string; type: string }>
}

export interface PAPRDBalance {
  address: string
  balance: number
  decimals: number
}

export interface CollateralInfo {
  address: string
  collateralType: number
  amount: number
  ratio: number
}

// Create a new wallet
export async function createWallet(): Promise<Wallet> {
  try {
    console.log("Creating wallet, API URL:", API_BASE_URL)
    const response = await fetch(`${API_BASE_URL}/wallet`, {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error(`Failed to create wallet: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating wallet:", error)
    throw error
  }
}

// Import a wallet using a private key
export async function importWallet(privateKey: string): Promise<Wallet> {
  try {
    const response = await fetch(`${API_BASE_URL}/wallet/import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ privateKey }),
    })

    if (!response.ok) {
      throw new Error(`Failed to import wallet: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error importing wallet:", error)
    throw error
  }
}

// Get wallet balance
export async function getWalletBalance(address: string): Promise<WalletBalance> {
  try {
    const response = await fetch(`${API_BASE_URL}/balance/${address}`)

    if (!response.ok) {
      throw new Error(`Failed to get balance: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting wallet balance:", error)
    throw error
  }
}

// Send a transaction
export async function sendTransaction(
  from: string,
  to: string,
  amount: number,
  privateKey: string,
): Promise<{ status: string; txId: string; node: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        amount,
        privateKey,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Failed to send transaction: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error sending transaction:", error)
    throw error
  }
}

// Get blockchain status
export async function getBlockchainStatus(): Promise<BlockchainStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/status`)

    if (!response.ok) {
      throw new Error(`Failed to get blockchain status: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting blockchain status:", error)
    throw error
  }
}

// Get all blocks
export async function getBlocks(): Promise<{ blocks: Block[]; count: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/blocks`)

    if (!response.ok) {
      throw new Error(`Failed to get blocks: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting blocks:", error)
    throw error
  }
}

// Get block by index
export async function getBlockByID(id: string): Promise<Block> {
  try {
    const index = Number.parseInt(id)
    const response = await fetch(`${API_BASE_URL}/blocks/${index}`)

    if (!response.ok) {
      throw new Error(`Failed to get block: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting block by ID:", error)
    throw error
  }
}

// Request tokens from faucet (admin only)
export async function requestTokensFromFaucet(
  address: string,
  amount: number,
  adminKey: string,
): Promise<{ balance: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/faucet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        amount,
        adminKey,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Failed to request tokens: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error requesting tokens from faucet:", error)
    throw error
  }
}

// ==================== SMART CONTRACT FUNCTIONS ====================

// Deploy a new smart contract
export async function deployContract(
  owner: string,
  name: string,
  wasmCode: string,
  privateKey: string,
  fee: number = 100
): Promise<SmartContract> {
  try {
    const response = await fetch(`${API_BASE_URL}/contracts/deploy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        owner,
        name,
        code: wasmCode,
        privateKey,
        fee,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Failed to deploy contract: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error deploying contract:", error)
    throw error
  }
}

// Get all contracts
export async function getContracts(): Promise<{ contracts: SmartContract[]; count: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/contracts`)

    if (!response.ok) {
      throw new Error(`Failed to get contracts: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting contracts:", error)
    throw error
  }
}

// Get contract by ID
export async function getContractById(contractId: string): Promise<SmartContract> {
  try {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}`)

    if (!response.ok) {
      throw new Error(`Failed to get contract: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting contract by ID:", error)
    throw error
  }
}

// Call a contract function
export async function callContractFunction(
  contractId: string,
  functionName: string,
  args: any[],
  privateKey?: string
): Promise<any> {
  try {
    const body: any = {
      contractId,
      function: functionName,
      args,
    }

    if (privateKey) {
      body.privateKey = privateKey
    }

    const response = await fetch(`${API_BASE_URL}/contracts/call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Failed to call contract function: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error calling contract function:", error)
    throw error
  }
}

// ==================== PAPRD STABLECOIN FUNCTIONS ====================

// PAPRD Contract ID (from GitHub repo)
const PAPRD_CONTRACT_ID = "AdNe1e77857b790cf352e57a20c704add7ce86db6f7dc5b7d14cbea95cfffe0d"

// Get PAPRD total supply (using direct API endpoint)
export async function getPAPRDTotalSupply(): Promise<{ totalSupply: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/paprd/info`)

    if (!response.ok) {
      throw new Error(`Failed to get PAPRD info: ${response.statusText}`)
    }

    const result = await response.json()
    return { totalSupply: parseInt(result.totalSupply) }
  } catch (error) {
    console.error("Error getting PAPRD total supply:", error)
    throw error
  }
}

// Get PAPRD contract info (using direct API endpoint)
export async function getPAPRDInfo(): Promise<{
  contract: string
  decimals: number
  name: string
  owner: string
  paused: boolean
  status: string
  symbol: string
  totalSupply: string
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/paprd/info`)

    if (!response.ok) {
      throw new Error(`Failed to get PAPRD info: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting PAPRD info:", error)
    throw error
  }
}

// Get PAPRD balance (using direct API endpoint)
export async function getPAPRDBalance(address: string): Promise<{ balance: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/paprd/balance/${address}`)

    if (!response.ok) {
      throw new Error(`Failed to get PAPRD balance: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting PAPRD balance:", error)
    throw error
  }
}

// Get PAPRD balance (using smart contract call - alternative method)
export async function getPAPRDBalanceContract(address: string): Promise<{ balance: number }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "get_balance", [address])
  } catch (error) {
    console.error("Error getting PAPRD balance via contract:", error)
    throw error
  }
}

// Transfer PAPRD tokens (using direct API endpoint)
export async function transferPAPRD(
  to: string,
  amount: number,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  try {
    // For transfer, we need to derive the 'from' address from the private key
    // Since we don't have that functionality, we'll need to get it from localStorage or user input
    const fromAddress = localStorage.getItem('wallet_address')
    if (!fromAddress) {
      throw new Error("From address not found. Please connect your wallet first.")
    }

    const response = await fetch(`${API_BASE_URL}/paprd/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: to,
        amount: amount.toString(), // API expects string
        privateKey: privateKey,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Failed to transfer PAPRD: ${response.statusText}`)
    }

    const result = await response.json()
    
    // Handle the actual API response format
    if (result.success) {
      return { 
        success: true, 
        txId: result.transaction?.id || result.txId || 'success' 
      }
    } else {
      throw new Error(result.error || 'Transfer failed')
    }
  } catch (error) {
    console.error("Error transferring PAPRD:", error)
    throw error
  }
}

// Mint PAPRD tokens (using direct API endpoint)
export async function mintPAPRD(
  to: string,
  amount: number,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  try {
    const callerAddress = localStorage.getItem('wallet_address')
    if (!callerAddress) {
      throw new Error("Caller address not found. Please connect your wallet first.")
    }

    const response = await fetch(`${API_BASE_URL}/paprd/mint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caller: callerAddress,
        to: to,
        amount: amount.toString(),
        privateKey: privateKey,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Failed to mint PAPRD: ${response.statusText}`)
    }

    const result = await response.json()
    
    // Handle the actual API response format
    if (result.success) {
      return { 
        success: true, 
        txId: result.transaction?.id || result.txId || 'success' 
      }
    } else {
      throw new Error(result.error || 'Mint failed')
    }
  } catch (error) {
    console.error("Error minting PAPRD:", error)
    throw error
  }
}

// Burn PAPRD tokens (NOT AVAILABLE - no API endpoint)
export async function burnPAPRD(
  amount: number,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  throw new Error("Burn function is not available. The API endpoint /paprd/burn does not exist. Please contact the blockchain administrator to implement this endpoint.")
}

// Add collateral (NOT AVAILABLE - no API endpoint)
export async function addCollateral(
  amount: number,
  collateralType: number,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  throw new Error("Add collateral function is not available. The API endpoint /paprd/add-collateral does not exist. Please contact the blockchain administrator to implement this endpoint.")
}

// Remove collateral (NOT AVAILABLE - no API endpoint)
export async function removeCollateral(
  amount: number,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  throw new Error("Remove collateral function is not available. The API endpoint /paprd/remove-collateral does not exist. Please contact the blockchain administrator to implement this endpoint.")
}

// Get collateral balance (NOT AVAILABLE - no API endpoint)
export async function getCollateralBalance(
  address: string,
  collateralType: number
): Promise<{ balance: number }> {
  throw new Error("Get collateral balance function is not available. No API endpoint exists for this function. Please contact the blockchain administrator to implement this endpoint.")
}

// Get collateral ratio (using PAPRD info endpoint)
export async function getCollateralRatio(): Promise<{ ratio: number }> {
  try {
    // For now, return a default ratio since it's not in the info endpoint
    // This should be implemented properly when the API supports it
    return { ratio: 150 } // Default 150% collateral ratio
  } catch (error) {
    console.error("Error getting collateral ratio:", error)
    throw error
  }
}

// Add minter (NOT AVAILABLE - no API endpoint)
export async function addMinter(
  address: string,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  throw new Error("Add minter function is not available. The API endpoint /paprd/add-minter does not exist. Please contact the blockchain administrator to implement this endpoint.")
}

// Remove minter (NOT AVAILABLE - no API endpoint)
export async function removeMinter(
  address: string,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  throw new Error("Remove minter function is not available. The API endpoint /paprd/remove-minter does not exist. Please contact the blockchain administrator to implement this endpoint.")
}

// Blacklist address (NOT AVAILABLE - no API endpoint)
export async function blacklistAddress(
  address: string,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  throw new Error("Blacklist function is not available. The API endpoint /paprd/blacklist does not exist. Please contact the blockchain administrator to implement this endpoint.")
}

// Unblacklist address (NOT AVAILABLE - no API endpoint)
export async function unblacklistAddress(
  address: string,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  throw new Error("Unblacklist function is not available. The API endpoint /paprd/unblacklist does not exist. Please contact the blockchain administrator to implement this endpoint.")
}

// Pause contract (NOT AVAILABLE - no API endpoint)
export async function pauseContract(privateKey: string): Promise<{ success: boolean; txId: string }> {
  throw new Error("Pause contract function is not available. The API endpoint /paprd/pause does not exist. Please contact the blockchain administrator to implement this endpoint.")
}

// Unpause contract (NOT AVAILABLE - no API endpoint)
export async function unpauseContract(privateKey: string): Promise<{ success: boolean; txId: string }> {
  throw new Error("Unpause contract function is not available. The API endpoint /paprd/unpause does not exist. Please contact the blockchain administrator to implement this endpoint.")
}

// Set collateral ratio (NOT AVAILABLE - no API endpoint)
export async function setCollateralRatio(
  ratio: number,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  throw new Error("Set collateral ratio function is not available. The API endpoint /paprd/set-collateral-ratio does not exist. Please contact the blockchain administrator to implement this endpoint.")
}

// Transfer ownership (NOT AVAILABLE - no API endpoint)
export async function transferOwnership(
  newOwner: string,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  throw new Error("Transfer ownership function is not available. The API endpoint /paprd/transfer-ownership does not exist. Please contact the blockchain administrator to implement this endpoint.")
}

// View functions (using PAPRD info endpoint)
export async function getPAPRDOwner(): Promise<{ owner: string }> {
  try {
    const info = await getPAPRDInfo()
    return { owner: info.owner }
  } catch (error) {
    console.error("Error getting PAPRD owner:", error)
    throw error
  }
}

export async function isPAPRDPaused(): Promise<{ paused: boolean }> {
  try {
    const info = await getPAPRDInfo()
    return { paused: info.paused }
  } catch (error) {
    console.error("Error checking if PAPRD is paused:", error)
    throw error
  }
}

export async function isBlacklisted(address: string): Promise<{ blacklisted: boolean }> {
  throw new Error("Blacklist check function is not available. No API endpoint exists for this function. Please contact the blockchain administrator to implement this endpoint.")
}

export async function isMinter(address: string): Promise<{ minter: boolean }> {
  throw new Error("Minter check function is not available. No API endpoint exists for this function. Please contact the blockchain administrator to implement this endpoint.")
}
