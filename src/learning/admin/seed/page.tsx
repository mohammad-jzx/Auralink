"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { seedAslDictionary } from "../../lib/firestore/seed-asl-dictionary"
import { seedAdditionalAslDictionary } from "../../lib/firestore/seed-asl-dictionary-additional"

export default function AdminSeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeedAsl = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    
    try {
      const result = await seedAslDictionary()
      setResult(result)
    } catch (err) {
      console.error("Seeding error:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred. Make sure Firebase is configured correctly.")
    } finally {
      setLoading(false)
    }
  }
  
  const handleSeedAdditionalAsl = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    
    try {
      const result = await seedAdditionalAslDictionary()
      setResult(result)
    } catch (err) {
      console.error("Seeding error:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred. Make sure Firebase is configured correctly.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Admin Seed Tools</h1>
      
      {/* Firebase Setup Instructions */}
      <Card className="mb-8 border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">⚠️ Firebase Setup Required</CardTitle>
          <CardDescription className="text-yellow-700">
            To use this tool, you need to configure Firebase first:
            <br />
            1. Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">console.firebase.google.com</a>
            <br />
            2. Enable Firestore Database
            <br />
            3. Update the Firebase config in <code>src/learning/lib/firestore/config.ts</code>
            <br />
            4. Or create a <code>.env.local</code> file with your Firebase credentials
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Seed ASL Dictionary</CardTitle>
          <CardDescription>
            Add ASL signs from YouTube videos to the dictionary collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleSeedAsl} 
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? "Processing..." : "Seed Basic ASL (Video 1)"}
              </Button>
              
              <Button 
                onClick={handleSeedAdditionalAsl} 
                disabled={loading}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Processing..." : "Seed Common Signs (Video 2)"}
              </Button>
            </div>
            
            {result && (
              <div className="p-4 bg-green-50 text-green-700 rounded-md">
                <p className="font-semibold">Success!</p>
                <p>Added {result.count} ASL dictionary items to Firestore.</p>
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
