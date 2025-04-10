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
