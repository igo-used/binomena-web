"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ApiDebug() {
  const [apiUrl, setApiUrl] = useState<string>("")
  const [apiStatus, setApiStatus] = useState<string>("Checking...")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_BLOCKCHAIN_API_URL || "Not set"
    setApiUrl(url)

    const checkApi = async () => {
      try {
        if (url === "Not set") {
          setApiStatus("API URL not configured")
          setError("Environment variable is not set")
          return
        }

        const response = await fetch(`${url}/status`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(5000),
        }).catch((e) => {
          throw new Error(`Network error: ${e.message}`)
        })

        if (response.ok) {
          setApiStatus("Connected")
          setError(null)
        } else {
          setApiStatus("Error")
          setError(`API returned status: ${response.status}`)
        }
      } catch (err: any) {
        setApiStatus("Error")
        setError(err.message || "Unknown error")
      }
    }

    checkApi()
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>API Connection Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span className={`${apiStatus === "Connected" ? "text-green-500" : "text-red-500"}`}>
              {apiStatus}
            </span>
          </div>
          {error && (
            <div className="text-red-500 mt-2">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
