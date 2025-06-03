import React, { useState } from 'react'
import Image from 'next/image'
import { getTokenLogo, getTokenInfo } from '@/lib/token-registry'
import { Badge } from './badge'

interface TokenLogoProps {
  symbol: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSymbol?: boolean
  showName?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

export function TokenLogo({ 
  symbol, 
  size = 'md', 
  showSymbol = false, 
  showName = false,
  className = ''
}: TokenLogoProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const tokenInfo = getTokenInfo(symbol)
  const logoUrl = getTokenLogo(symbol)
  const sizeClass = sizeClasses[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClass} relative rounded-full overflow-hidden flex items-center justify-center ${
        imageLoaded && !imageError 
          ? 'bg-transparent' // No background when image loads successfully
          : 'bg-gradient-to-br from-blue-500 to-purple-600' // Gradient background for fallback
      }`}>
        {!imageError && (
          <Image
            src={logoUrl}
            alt={`${symbol} logo`}
            width={size === 'xl' ? 64 : size === 'lg' ? 48 : size === 'md' ? 32 : 24}
            height={size === 'xl' ? 64 : size === 'lg' ? 48 : size === 'md' ? 32 : 24}
            className="object-cover rounded-full"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true)
              setImageLoaded(false)
            }}
          />
        )}
        
        {/* Fallback text when image fails to load */}
        {imageError && (
          <span className={`text-white font-bold ${
            size === 'xl' ? 'text-xl' : 
            size === 'lg' ? 'text-lg' : 
            size === 'md' ? 'text-sm' : 'text-xs'
          }`}>
            {symbol.slice(0, 2)}
          </span>
        )}
      </div>
      
      {(showSymbol || showName) && tokenInfo && (
        <div className="flex flex-col">
          {showName && (
            <span className="font-medium text-sm">{tokenInfo.name}</span>
          )}
          {showSymbol && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs">{symbol}</span>
              {tokenInfo.type === 'native' && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  Native
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 