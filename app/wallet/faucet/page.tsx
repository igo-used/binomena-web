// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { ArrowLeft } from "lucide-react"
// // import { requestTokensFromFaucet } from "@/lib/api"

// export default function FaucetPage() {
//   const [address, setAddress] = useState<string>("")
//   const [amount, setAmount] = useState<string>("100")
//   const [adminKey, setAdminKey] = useState<string>("")
//   const [loading, setLoading] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<string | null>(null)

//   const handleRequest = async () => {
//     if (!address) {
//       setError("Please enter a wallet address")
//       return
//     }

//     if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
//       setError("Please enter a valid amount")
//       return
//     }

//     if (!adminKey) {
//       setError("Please enter the admin key")
//       return
//     }

//     setLoading(true)
//     setError(null)
//     setSuccess(null)

//     try {
//       const result = await requestTokensFromFaucet(address, Number(amount), adminKey)
//       setSuccess(`Successfully transferred ${amount} BNM to ${address}. New balance: ${result.balance} BNM`)
//     } catch (err: any) {
//       setError(err.message || "Failed to request tokens")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="container py-10">
//       <div className="mb-6">
//         <Button asChild variant="outline">
//           <Link href="/wallet">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Wallet
//           </Link>
//         </Button>
//       </div>

//       <h1 className="text-3xl font-bold mb-6">Request Tokens from Faucet</h1>

//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>Faucet Request</CardTitle>
//           <CardDescription>Request BNM tokens from the faucet (admin only)</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col gap-4">
//             <div>
//               <label htmlFor="address" className="block text-sm font-medium mb-1">
//                 Wallet Address
//               </label>
//               <Input
//                 id="address"
//                 placeholder="Enter wallet address (starts with AdNe)"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//               />
//             </div>

//             <div>
//               <label htmlFor="amount" className="block text-sm font-medium mb-1">
//                 Amount (BNM)
//               </label>
//               <Input
//                 id="amount"
//                 type="number"
//                 placeholder="Enter amount"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//               />
//             </div>

//             <div>
//               <label htmlFor="adminKey" className="block text-sm font-medium mb-1">
//                 Admin Key
//               </label>
//               <Input
//                 id="adminKey"
//                 type="password"
//                 placeholder="Enter admin key"
//                 value={adminKey}
//                 onChange={(e) => setAdminKey(e.target.value)}
//               />
//             </div>

//             {error && (
//               <Alert variant="destructive">
//                 <AlertTitle>Error</AlertTitle>
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             {success && (
//               <Alert variant="default" className="bg-green-50 border border-green-500 text-green-700">
//                 <AlertTitle>Success</AlertTitle>
//                 <AlertDescription>{success}</AlertDescription>
//               </Alert>
//             )}

//             <Button onClick={handleRequest} disabled={loading} className="mt-2">
//               {loading ? "Processing..." : "Request Tokens"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
