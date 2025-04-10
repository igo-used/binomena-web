"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft } from "lucide-react"
import { getBlocks } from "@/lib/api"
import type { Transaction } from "@/lib/api"

export default function TransactionHistoryPage() {
  const [address, setAddress] = useState<string>("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!address) {
      setError("Please enter a wallet address")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get all blocks and filter transactions for this address
      const { blocks } = await getBlocks()

      const addressTransactions: Transaction[] = []

      // Loop through all blocks and find transactions for this address
      blocks.forEach((block) => {
        block.data.forEach((tx) => {
          if (tx.from === address || tx.to === address) {
            addressTransactions.push(tx)
          }
        })
      })

      setTransactions(addressTransactions)

      if (addressTransactions.length === 0) {
        setError("No transactions found for this address")
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch transaction history")
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/wallet">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Wallet
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Transactions</CardTitle>
          <CardDescription>Enter a wallet address to view its transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter wallet address (starts with AdNe)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {transactions.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium truncate max-w-[150px]">{tx.id}</TableCell>
                      <TableCell className={tx.from === address ? "font-bold" : ""}>
                        {tx.from === address ? "You" : tx.from}
                      </TableCell>
                      <TableCell className={tx.to === address ? "font-bold" : ""}>
                        {tx.to === address ? "You" : tx.to}
                      </TableCell>
                      <TableCell className={tx.from === address ? "text-red-500" : "text-green-500"}>
                        {tx.from === address ? "-" : "+"}
                        {tx.amount} BNM
                      </TableCell>
                      <TableCell>{formatTimestamp(tx.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
