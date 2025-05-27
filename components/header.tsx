"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "./mode-toggle"
import { Menu, X, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Wallet BNM", href: "/wallet" },
    { name: "Wallet PAPRD", href: "/wallet/paprd" },
    { name: "Explorer", href: "/explorer" },
    { name: "Buy Tokens", href: "/buy" },
  ]

  const contractLinks = [
    { name: "Overview", href: "/contracts" },
    { name: "Deploy Contract", href: "/contracts/deploy" },
    { name: "My Contracts", href: "/contracts/list" },
    { name: "Templates", href: "/contracts/templates" },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isContractPage = pathname.startsWith('/contracts')

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#d1ff00] to-green-500 text-transparent bg-clip-text">
              Binomena
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-[#d1ff00] ${
                pathname === item.href ? "text-[#d1ff00]" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Smart Contracts Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`text-sm font-medium transition-colors hover:text-[#d1ff00] ${
                  isContractPage ? "text-[#d1ff00]" : "text-muted-foreground"
                }`}
              >
                Smart Contracts
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {contractLinks.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href} className="cursor-pointer">
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild className="hidden md:inline-flex bg-[#d1ff00] text-black hover:bg-lime-300">
            <Link href="/wallet/create">Create Wallet</Link>
          </Button>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMenuOpen ? <X className="h-6 w-6 text-[#d1ff00]" /> : <Menu className="h-6 w-6 text-[#d1ff00]" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block text-sm font-medium transition-colors hover:text-[#d1ff00] ${
                  pathname === item.href ? "text-[#d1ff00]" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Smart Contracts Section */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Smart Contracts</div>
              {contractLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block pl-4 text-sm transition-colors hover:text-[#d1ff00] ${
                    pathname === item.href ? "text-[#d1ff00]" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <Button asChild className="w-full mt-4 bg-[#d1ff00] text-black hover:bg-lime-300">
              <Link href="/wallet/create" onClick={() => setIsMenuOpen(false)}>
                Create Wallet
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
