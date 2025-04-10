"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, ArrowLeft, ExternalLink } from "lucide-react"
import { getBlockByIndex } from "@/lib/api"
import type { Block, Transaction } from "@/lib/api"

export default function BlockDetailPage({ params }: { params: { id: string } }) {
  const [block, setBlock] = useState<Block | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBlock()
  }, [params.id])

  const fetchBlock = async () => {
    setLoading(true)
    setError(null)

    try {
      const blockIndex = Number.parseInt(params.id)
      if (isNaN(blockIndex)) {
        throw new Error("Invalid block index")
      }

      const blockData = await getBlockByIndex(blockIndex)
      setBlock(blockData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch block data")
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
          <Link href="/explorer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explorer
          </Link>
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Block #{params.id}</h1>
        <p className="max-w-[700px] text-muted-foreground">Detailed information about this block</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-8">Loading block data...</div>
      ) : block ? (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Block Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Block Index</p>
                  <p>{block.index}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                  <p>{formatTimestamp(block.timestamp)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Hash</p>
                  <p className="break-all">{block.hash}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Previous Hash</p>
                  <p className="break-all">{block.previousHash}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Validator</p>
                  <p>{block.validator}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                  <p>{block.data.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {block.data.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Transactions included in this block</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {block.data.map((tx: Transaction) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium truncate max-w-[150px]">{tx.id}</TableCell>
                        <TableCell className="truncate max-w-[150px]">
                          <Link
                            href={`/wallet/balance?address=${tx.from}`}
                            className="hover:underline flex items-center"
                          >
                            {tx.from}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Link>
                        </TableCell>
                        <TableCell className="truncate max-w-[150px]">
                          <Link href={`/wallet/balance?address=${tx.to}`} className="hover:underline flex items-center">
                            {tx.to}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">{tx.amount} BNM</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-4 text-muted-foreground">No transactions in this block</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  )
}
