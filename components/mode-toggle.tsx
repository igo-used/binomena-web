"use client"
import { Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { setTheme } = useTheme()

  // Set theme to dark on component mount
  useEffect(() => {
    setTheme("dark")
  }, [setTheme])

  return (
    <Button variant="ghost" size="icon" disabled>
      <Moon className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Dark theme enabled</span>
    </Button>
  )
}
