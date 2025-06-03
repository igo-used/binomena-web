import { NextResponse } from 'next/server'
import { getTokenListJSON, getAllTokens, getTokenInfo } from '@/lib/token-registry'

// GET /api/tokens - Returns all tokens in standard token list format
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  
  try {
    if (symbol) {
      // Return specific token info
      const tokenInfo = getTokenInfo(symbol)
      if (!tokenInfo) {
        return NextResponse.json(
          { error: 'Token not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(tokenInfo)
    } else {
      // Return token list in standard format for exchanges/wallets
      const tokenList = getTokenListJSON()
      return NextResponse.json(tokenList)
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch token data' },
      { status: 500 }
    )
  }
} 