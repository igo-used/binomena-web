// Token Registry - Centralized token metadata for Binomena ecosystem
export interface TokenInfo {
  symbol: string
  name: string
  decimals: number
  logo: string
  description: string
  totalSupply: string
  type: 'native' | 'stablecoin' | 'utility'
  contractAddress?: string
  website?: string
  socials?: {
    twitter?: string
    telegram?: string
    discord?: string
  }
}

// Binomena Token Registry
export const TOKENS: Record<string, TokenInfo> = {
  BNM: {
    symbol: 'BNM',
    name: 'Binomena',
    decimals: 18,
    logo: '/tokens/bnm.png', // Your 150x150 logo here
    description: 'Native utility token of the Binomena blockchain ecosystem',
    totalSupply: '1,000,000,000', // 1 billion
    type: 'native',
    website: 'https://www.binomchainapp.fyi',
    socials: {
      // twitter: '@binomena',
      // telegram: 'https://t.me/binomena',
    }
  },
  PAPRD: {
    symbol: 'PAPRD',
    name: 'PAPRD Stablecoin',
    decimals: 18,
    logo: '/tokens/paprd.png', // You can create a PAPRD logo too
    description: 'USD-pegged stablecoin with 150% collateral backing',
    totalSupply: 'Variable', // Mint/burn mechanism
    type: 'stablecoin',
    contractAddress: 'paprd_contract_address_here',
    website: 'https://www.binomchainapp.fyi/wallet/paprd'
  }
}

// Helper functions
export const getTokenInfo = (symbol: string): TokenInfo | undefined => {
  return TOKENS[symbol.toUpperCase()]
}

export const getAllTokens = (): TokenInfo[] => {
  return Object.values(TOKENS)
}

export const getTokenLogo = (symbol: string): string => {
  const token = getTokenInfo(symbol)
  return token?.logo || '/tokens/default.png'
}

// For exchange integration - standard token list format
export const getTokenListJSON = () => {
  return {
    name: 'Binomena Token List',
    version: {
      major: 1,
      minor: 0,
      patch: 0
    },
    keywords: ['binomena', 'blockchain', 'defi'],
    logoURI: '/tokens/bnm.png',
    tokens: Object.values(TOKENS).map(token => ({
      chainId: 1, // Your blockchain chain ID
      address: token.contractAddress || 'native',
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      logoURI: `https://www.binomchainapp.fyi${token.logo}`,
      tags: [token.type]
    }))
  }
} 