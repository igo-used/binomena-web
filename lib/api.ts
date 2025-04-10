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
  const response = await fetch(`${API_BASE_URL}/wallet`, {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error(`Failed to create wallet: ${response.statusText}`)
  }

  return response.json()
}

// Import a wallet using a private key
export async function importWallet(privateKey: string): Promise<Wallet> {
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

  return response.json()
}

// Get wallet balance
export async function getWalletBalance(address: string): Promise<WalletBalance> {
  const response = await fetch(`${API_BASE_URL}/balance/${address}`)

  if (!response.ok) {
    throw new Error(`Failed to get balance: ${response.statusText}`)
  }

  return response.json()
}

// Send a transaction
export async function sendTransaction(
  from: string,
  to: string,
  amount: number,
  privateKey: string,
): Promise<{ status: string; txId: string; node: string }> {
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

  return response.json()
}

// Get blockchain status
export async function getBlockchainStatus(): Promise<BlockchainStatus> {
  const response = await fetch(`${API_BASE_URL}/status`)

  if (!response.ok) {
    throw new Error(`Failed to get blockchain status: ${response.statusText}`)
  }

  return response.json()
}

// Get all blocks
export async function getAllBlocks(): Promise<{ blocks: Block[]; count: number }> {
  const response = await fetch(`${API_BASE_URL}/blocks`)

  if (!response.ok) {
    throw new Error(`Failed to get blocks: ${response.statusText}`)
  }

  return response.json()
}

// Get block by index
export async function getBlockByIndex(index: number): Promise<Block> {
  const response = await fetch(`${API_BASE_URL}/blocks/${index}`)

  if (!response.ok) {
    throw new Error(`Failed to get block: ${response.statusText}`)
  }

  return response.json()
}

// Request tokens from faucet (admin only)
export async function requestTokensFromFaucet(
  address: string,
  amount: number,
  adminKey: string,
): Promise<{ status: string; message: string; balance: number }> {
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

  return response.json()
}

// Distribute initial tokens (admin only)
export async function distributeInitialTokens(
  adminKey: string,
  founderAddress: string,
  treasuryAddress: string,
  communityAddress: string,
  founderPercent: number,
  treasuryPercent: number,
  communityPercent: number,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/admin/distribute-initial-tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      adminKey,
      founderAddress,
      treasuryAddress,
      communityAddress,
      founderPercent,
      treasuryPercent,
      communityPercent,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || `Failed to distribute tokens: ${response.statusText}`)
  }

  return response.json()
}
