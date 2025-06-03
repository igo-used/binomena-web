import React from 'react'

interface DefaultTokenIconProps {
  symbol: string
  size: number
  className?: string
}

export function DefaultTokenIcon({ symbol, size, className = '' }: DefaultTokenIconProps) {
  // Generate consistent color based on symbol
  const generateColor = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = hash % 360
    return `hsl(${hue}, 70%, 50%)`
  }

  const color1 = generateColor(symbol)
  const color2 = generateColor(symbol + 'salt')

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        fontSize: size / 3
      }}
    >
      {symbol.slice(0, 2).toUpperCase()}
    </div>
  )
} 