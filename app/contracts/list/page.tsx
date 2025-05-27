"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { AlertCircle, Search, ExternalLink, Plus, FileCode, Eye } from "lucide-react"
import { getContracts, type SmartContract } from "@/lib/api"

export default function ContractListPage() {
  const [contracts, setContracts] = useState<SmartContract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getContracts()
      setContracts(result.contracts || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch contracts")
    } finally {
      setLoading(false)
    }
  }

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.contractId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.owner.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Smart Contracts</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
          View and interact with deployed smart contracts on the Binomena blockchain
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contracts by name, ID, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild>
          <Link href="/contracts/deploy">
            <Plus className="mr-2 h-4 w-4" />
            Deploy Contract
          </Link>
        </Button>
      </div>

      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading contracts...</p>
        </div>
      ) : contracts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <FileCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Contracts Found</h3>
            <p className="text-muted-foreground mb-4">
              There are no smart contracts deployed yet. Be the first to deploy one!
            </p>
            <Button asChild>
              <Link href="/contracts/deploy">Deploy Your First Contract</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContracts.map((contract) => (
              <Card key={contract.contractId} className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{contract.name}</CardTitle>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      contract.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                    }`}>
                      {contract.status}
                    </div>
                  </div>
                  <CardDescription className="font-mono text-xs">
                    {contract.contractId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Owner:</strong>
                      <div className="font-mono text-xs text-muted-foreground break-all">
                        {contract.owner}
                      </div>
                    </div>
                    <div>
                      <strong>Address:</strong>
                      <div className="font-mono text-xs text-muted-foreground break-all">
                        {contract.address}
                      </div>
                    </div>
                    {contract.createdAt && (
                      <div>
                        <strong>Created:</strong>
                        <div className="text-xs text-muted-foreground">
                          {formatTimestamp(contract.createdAt)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <Link href={`/contracts/interact/${contract.contractId}`}>
                        <Eye className="mr-1 h-3 w-3" />
                        Interact
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/explorer/contract/${contract.contractId}`}>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table view for larger screens */}
          <Card className="hidden lg:block">
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
              <CardDescription>
                Comprehensive view of all deployed smart contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contract ID</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow key={contract.contractId}>
                      <TableCell className="font-medium">{contract.name}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {contract.contractId.slice(0, 16)}...
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {contract.owner.slice(0, 16)}...
                      </TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded text-xs font-medium inline-block ${
                          contract.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                        }`}>
                          {contract.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {contract.createdAt ? formatTimestamp(contract.createdAt) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/contracts/interact/${contract.contractId}`}>
                              Interact
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {filteredContracts.length === 0 && searchQuery && !loading && (
        <Card>
          <CardContent className="text-center py-10">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground">
              No contracts match your search criteria. Try a different search term.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 