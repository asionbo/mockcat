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
import { LanguageSelector } from "@/app/components/LanguageSelector"
import { useLanguage } from "@/app/lib/i18n/LanguageContext"

export default function Home() {
  const [tableStructure, setTableStructure] = useState("")
  const [recordCount, setRecordCount] = useState(5)
  const [mockData, setMockData] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sqlCopied, setSqlCopied] = useState(false)
  const [inputFormat, setInputFormat] = useState("simple")
  const { toast } = useToast()
  const { t } = useLanguage()

  const generateMockData = async () => {
    if (!tableStructure.trim()) {
      toast({
        title: t("errorTitle"),
        description: t("errorEmptyStructure"),
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
        throw new Error(t("errorGeneration"))
      }

      const data = await response.json()
      setMockData(JSON.stringify(data.mockData, null, 2))
      toast({
        title: t("successTitle"),
        description: t("successMessage"),
      })
    } catch (error) {
      toast({
        title: t("errorTitle"),
        description: error instanceof Error ? error.message : t("errorGeneration"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    toast({
      title: t("copiedTitle"),
      description: t("copiedJson"),
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const copySqlToClipboard = (sql: string) => {
    navigator.clipboard.writeText(sql)
    setSqlCopied(true)
    toast({
      title: t("copiedTitle"),
      description: t("copiedSql"),
    })
    setTimeout(() => setSqlCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">{t("title")}</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">{t("poweredBy")}</p>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">{t("title")}</CardTitle>
              <CardDescription>
                {t("description")}
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
                      <span className="text-sm font-medium">{t("simpleFormat")}</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="sql" id="sql" className="peer sr-only" />
                    <Label
                      htmlFor="sql"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <KeyRound className="mb-3 h-6 w-6" />
                      <span className="text-sm font-medium">{t("sqlFormat")}</span>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="grid gap-2">
                  <Label htmlFor="tableStructure">{t("tableStructure")}</Label>
                  <Textarea
                    id="tableStructure"
                    placeholder={
                      inputFormat === "simple"
                        ? t("inputPlaceholderSimple")
                        : t("inputPlaceholderSQL")
                    }
                    className="min-h-[200px] font-mono text-sm"
                    value={tableStructure}
                    onChange={(e) => setTableStructure(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    {inputFormat === "simple"
                      ? t("formatHintSimple")
                      : t("formatHintSQL")}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="recordCount">{t("recordCount")}</Label>
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
                    {t("generating")}
                  </>
                ) : (
                  t("generateButton")
                )}
              </Button>
            </CardFooter>
          </Card>

          {mockData && (
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{t("generatedDataTitle")}</CardTitle>
                  <CardDescription>{t("generatedDataDesc")}</CardDescription>
                </div>
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
                    <TabsTrigger value="sql" className="flex items-center gap-1">
                      <Database className="h-4 w-4" />
                      SQL INSERT
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="json">
                    <div className="relative">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="absolute top-2 right-2 z-10" 
                        onClick={() => copyToClipboard(mockData)}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px] text-sm">
                        {mockData}
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="table">
                    <div className="overflow-auto max-h-[500px]">
                      <JsonTable data={mockData} />
                    </div>
                  </TabsContent>
                  <TabsContent value="sql">
                    <div className="overflow-auto max-h-[500px]">
                      <SqlInsertStatements data={mockData} onCopy={copySqlToClipboard} copied={sqlCopied} />
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
          <p className="text-sm text-muted-foreground">{t("footer")}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              {t("about")}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              {t("documentation")}
            </a>
            <a href="https://github.com/asionbo/mockcat" className="text-sm text-muted-foreground hover:text-foreground">
              {t("github")}
            </a>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  )
}

// Define an interface for the JsonTable props
interface JsonTableProps {
  data: string | unknown;
}

function JsonTable({ data }: JsonTableProps) {
  const { t } = useLanguage();
  
  try {
    const jsonData = typeof data === "string" ? JSON.parse(data) : data
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      return <p>{t("noData")}</p>
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
    return <p>{t("errorDisplayTable")} {error instanceof Error ? error.message : String(error)}</p>
  }
}

// SqlInsertStatements component
interface SqlInsertStatementsProps {
  data: string | unknown;
  onCopy?: (sql: string) => void;
  copied?: boolean;
}

function SqlInsertStatements({ data, onCopy, copied }: SqlInsertStatementsProps) {
  const { t } = useLanguage();
  
  try {
    const jsonData = typeof data === "string" ? JSON.parse(data) : data
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      return <p>{t("noData")}</p>
    }

    // Extract table name from the structure or use a default
    const tableName = "table_name"
    
    const sqlStatements = jsonData.map(row => {
      const columns = Object.keys(row).join(", ")
      const values = Object.values(row).map(value => {
        if (value === null) return 'NULL'
        if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`
        if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'`
        return value
      }).join(", ")
      
      return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`
    }).join('\n')

    return (
      <div className="relative">
        {onCopy && (
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-2 right-2 z-10" 
            onClick={() => onCopy(sqlStatements)}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        )}
        <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px] text-sm">
          {sqlStatements}
        </pre>
      </div>
    )
  } catch (error) {
    return <p>{t("errorSqlGeneration")} {error instanceof Error ? error.message : String(error)}</p>
  }
}

