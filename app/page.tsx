"use client"

import { useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Copy, Check, Database, Code, Table2, FileText, KeyRound } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Home() {
  const [tableStructure, setTableStructure] = useState("")
  const [recordCount, setRecordCount] = useState(5)
  const [mockData, setMockData] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [inputFormat, setInputFormat] = useState("simple")
  const { toast } = useToast()

  const generateMockData = async () => {
    if (!tableStructure.trim()) {
      toast({
        title: "Error",
        description: "Please enter a table structure",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableStructure,
          recordCount,
          inputFormat,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate mock data")
      }

      const data = await response.json()
      setMockData(JSON.stringify(data.mockData, null, 2))
      toast({
        title: "Success",
        description: "Mock data generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate mock data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mockData)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Mock data copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">MockCat</h1>
          </div>
          <p className="text-sm text-muted-foreground">Powered by Gemini AI</p>
        </div>
      </header>

      <main className="container mx-auto py-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Table Structure to Mock Data Generator</CardTitle>
              <CardDescription>
                Enter your table structure and we'll generate realistic mock data for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <RadioGroup
                  defaultValue="simple"
                  value={inputFormat}
                  onValueChange={setInputFormat}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="simple" id="simple" className="peer sr-only" />
                    <Label
                      htmlFor="simple"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <FileText className="mb-3 h-6 w-6" />
                      <span className="text-sm font-medium">Simple Format</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="sql" id="sql" className="peer sr-only" />
                    <Label
                      htmlFor="sql"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <KeyRound className="mb-3 h-6 w-6" />
                      <span className="text-sm font-medium">SQL CREATE TABLE</span>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="grid gap-2">
                  <Label htmlFor="tableStructure">Table Structure</Label>
                  <Textarea
                    id="tableStructure"
                    placeholder={
                      inputFormat === "simple"
                        ? "Enter your table structure (e.g., id: number, name: string, email: string, age: number)"
                        : "Enter SQL CREATE TABLE statement (e.g., CREATE TABLE users (...))"
                    }
                    className="min-h-[200px] font-mono text-sm"
                    value={tableStructure}
                    onChange={(e) => setTableStructure(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    {inputFormat === "simple"
                      ? "Format: columnName: dataType, columnName: dataType, ..."
                      : "Format: CREATE TABLE tableName (column1 dataType, column2 dataType, ...)"}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="recordCount">Number of Records</Label>
                  <Input
                    id="recordCount"
                    type="number"
                    min="1"
                    max="100"
                    value={recordCount}
                    onChange={(e) => setRecordCount(Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={generateMockData} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Mock Data"
                )}
              </Button>
            </CardFooter>
          </Card>

          {mockData && (
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Generated Mock Data</CardTitle>
                  <CardDescription>Your mock data is ready to use</CardDescription>
                </div>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="json">
                  <TabsList className="mb-4">
                    <TabsTrigger value="json" className="flex items-center gap-1">
                      <Code className="h-4 w-4" />
                      JSON
                    </TabsTrigger>
                    <TabsTrigger value="table" className="flex items-center gap-1">
                      <Table2 className="h-4 w-4" />
                      Table
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="json">
                    <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px] text-sm">{mockData}</pre>
                  </TabsContent>
                  <TabsContent value="table">
                    <div className="overflow-auto max-h-[500px]">
                      <JsonTable data={mockData} />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="container mx-auto py-6 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MockCat. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Documentation
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              GitHub
            </a>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  )
}

function JsonTable({ data }) {
  try {
    const jsonData = typeof data === "string" ? JSON.parse(data) : data
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      return <p>No data to display</p>
    }

    const columns = Object.keys(jsonData[0])

    return (
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column) => (
                <th key={column} className="p-2 text-left font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jsonData.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-muted/50"}>
                {columns.map((column) => (
                  <td key={`${i}-${column}`} className="p-2 text-sm">
                    {typeof row[column] === "object" ? JSON.stringify(row[column]) : String(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  } catch (error) {
    return <p>Error displaying table: {error.message}</p>
  }
}

