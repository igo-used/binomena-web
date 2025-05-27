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

// Get PAPRD total supply
export async function getPAPRDTotalSupply(): Promise<{ totalSupply: number }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "get_total_supply", [])
  } catch (error) {
    console.error("Error getting PAPRD total supply:", error)
    throw error
  }
}

// Get PAPRD balance
export async function getPAPRDBalance(address: string): Promise<{ balance: number }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "get_balance", [address])
  } catch (error) {
    console.error("Error getting PAPRD balance:", error)
    throw error
  }
}

// Transfer PAPRD tokens
export async function transferPAPRD(
  to: string,
  amount: number,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "transfer", [to, amount], privateKey)
  } catch (error) {
    console.error("Error transferring PAPRD:", error)
    throw error
  }
}

// Mint PAPRD tokens (minter only)
export async function mintPAPRD(
  to: string,
  amount: number,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "mint", [to, amount], privateKey)
  } catch (error) {
    console.error("Error minting PAPRD:", error)
    throw error
  }
}

// Burn PAPRD tokens
export async function burnPAPRD(
  amount: number,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "burn", [amount], privateKey)
  } catch (error) {
    console.error("Error burning PAPRD:", error)
    throw error
  }
}

// Add collateral
export async function addCollateral(
  amount: number,
  collateralType: number,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "add_collateral", [amount, collateralType], privateKey)
  } catch (error) {
    console.error("Error adding collateral:", error)
    throw error
  }
}

// Remove collateral
export async function removeCollateral(
  amount: number,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "remove_collateral", [amount], privateKey)
  } catch (error) {
    console.error("Error removing collateral:", error)
    throw error
  }
}

// Get collateral balance
export async function getCollateralBalance(
  address: string,
  collateralType: number
): Promise<{ balance: number }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "get_collateral_balance", [address, collateralType])
  } catch (error) {
    console.error("Error getting collateral balance:", error)
    throw error
  }
}

// Get collateral ratio
export async function getCollateralRatio(): Promise<{ ratio: number }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "get_collateral_ratio", [])
  } catch (error) {
    console.error("Error getting collateral ratio:", error)
    throw error
  }
}

// Add minter (owner only)
export async function addMinter(
  address: string,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "add_minter", [address], privateKey)
  } catch (error) {
    console.error("Error adding minter:", error)
    throw error
  }
}

// Remove minter (owner only)
export async function removeMinter(
  address: string,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "remove_minter", [address], privateKey)
  } catch (error) {
    console.error("Error removing minter:", error)
    throw error
  }
}

// Blacklist address (owner only)
export async function blacklistAddress(
  address: string,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "blacklist", [address], privateKey)
  } catch (error) {
    console.error("Error blacklisting address:", error)
    throw error
  }
}

// Unblacklist address (owner only)
export async function unblacklistAddress(
  address: string,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "unblacklist", [address], privateKey)
  } catch (error) {
    console.error("Error unblacklisting address:", error)
    throw error
  }
}

// Pause contract (owner only)
export async function pauseContract(privateKey: string): Promise<{ success: boolean; txId: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "pause", [], privateKey)
  } catch (error) {
    console.error("Error pausing contract:", error)
    throw error
  }
}

// Unpause contract (owner only)
export async function unpauseContract(privateKey: string): Promise<{ success: boolean; txId: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "unpause", [], privateKey)
  } catch (error) {
    console.error("Error unpausing contract:", error)
    throw error
  }
}

// Set collateral ratio (owner only)
export async function setCollateralRatio(
  ratio: number,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "set_collateral_ratio", [ratio], privateKey)
  } catch (error) {
    console.error("Error setting collateral ratio:", error)
    throw error
  }
}

// Transfer ownership (owner only)
export async function transferOwnership(
  newOwner: string,
  privateKey: string
): Promise<{ success: boolean; txId: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "transfer_ownership", [newOwner], privateKey)
  } catch (error) {
    console.error("Error transferring ownership:", error)
    throw error
  }
}

// View functions (no private key required)
export async function getPAPRDOwner(): Promise<{ owner: string }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "get_owner", [])
  } catch (error) {
    console.error("Error getting PAPRD owner:", error)
    throw error
  }
}

export async function isPAPRDPaused(): Promise<{ paused: boolean }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "is_paused", [])
  } catch (error) {
    console.error("Error checking if PAPRD is paused:", error)
    throw error
  }
}

export async function isBlacklisted(address: string): Promise<{ blacklisted: boolean }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "is_blacklisted", [address])
  } catch (error) {
    console.error("Error checking if address is blacklisted:", error)
    throw error
  }
}

export async function isMinter(address: string): Promise<{ minter: boolean }> {
  try {
    return await callContractFunction(PAPRD_CONTRACT_ID, "is_minter", [address])
  } catch (error) {
    console.error("Error checking if address is minter:", error)
    throw error
  }
}
