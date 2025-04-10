"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { AlertCircle, Search, ArrowRight } from "lucide-react"
import { getBlockchainStatus, getAllBlocks } from "@/lib/api"
import type { Block } from "@/lib/api"

export default function ExplorerPage() {
  const [status, setStatus] = useState<any>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [statusData, blocksData] = await Promise.all([getBlockchainStatus(), getAllBlocks()])

      setStatus(statusData)
      setBlocks(blocksData.blocks.slice(0, 10)) // Show only the latest 10 blocks
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blockchain data")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    // Implement search functionality (block number, transaction ID, or address)
    // For now, we'll just redirect to the block page if it's a number
    if (!isNaN(Number.parseInt(searchQuery))) {
      window.location.href = `/explorer/block/${searchQuery}`
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Blockchain Explorer</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Explore the Binomena blockchain
        </p>
      </div>

      <div className="mb-8">
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Search by block number, transaction ID, or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-8">Loading blockchain data...</div>
        ) : (
          <>
            {status && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Blocks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{status.blocks}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Token Supply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{status.tokenSupply.toLocaleString()} BNM</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Connected Peers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{status.peers}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Node Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold capitalize">{status.status}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-4">Latest Blocks</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Block</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Validator</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blocks.map((block) => (
                      <TableRow key={block.index}>
                        <TableCell className="font-medium">{block.index}</TableCell>
                        <TableCell>{formatTimestamp(block.timestamp)}</TableCell>
                        <TableCell>{block.data.length}</TableCell>
                        <TableCell className="truncate max-w-[150px]">{block.validator}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/explorer/block/${block.index}`}>
                              View Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-center py-4">
                <Button asChild variant="outline">
                  <Link href="/explorer/blocks">View All Blocks</Link>
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
