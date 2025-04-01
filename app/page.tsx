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
import { Loader2, Copy, Check, Database, Code, Table2, FileText, KeyRound, Github } from "lucide-react"
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
  const { t, language } = useLanguage()
  const [isGenerating, setIsGenerating] = useState(false)
  const [progressCount, setProgressCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const generateMockData = async () => {
    if (!tableStructure.trim()) {
      toast({
        title: t("errorTitle"),
        description: t("errorEmptyStructure"),
        variant: "destructive",
      })
      return
    }

    setMockData("")
    setIsLoading(true)
    setIsGenerating(true)
    setProgressCount(0)
    setTotalCount(recordCount)

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
          language,
        }),
      })

      if (!response.ok) {
        throw new Error(t("errorGeneration"))
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setMockData(JSON.stringify(data.mockData, null, 2))

      if (data.generatedCount < data.requestedCount) {
        toast({
          title: t("partialSuccessTitle"),
          description: t("partialSuccessMessage").replace('{generated}', data.generatedCount),
        })
      } else {
        toast({
          title: t("successTitle"),
          description: t("successMessage"),
        })
      }
    } catch (error) {
      toast({
        title: t("errorTitle"),
        description: error instanceof Error ? error.message : t("errorGeneration"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsGenerating(false)
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
      <header className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Database className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">{t("title")}</h1>
            </div>
            <p className="text-sm text-muted-foreground ml-8 italic mt-1">
              {t("slogan") || "Generate realistic mock data in seconds"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/asionbo/mockcat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-full hover:bg-muted/70 transition-all hover:shadow-md"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="md:col-span-2 border-2 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/40 border-b border-border/40">
              <CardTitle className="text-2xl font-semibold text-primary">{t("title")}</CardTitle>
              <CardDescription className="text-base">
                {t("description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="grid gap-8">
                <RadioGroup
                  defaultValue="simple"
                  value={inputFormat}
                  onValueChange={setInputFormat}
                  className="grid grid-cols-2 gap-6 sm:max-w-md mx-auto"
                >
                  <div>
                    <RadioGroupItem value="simple" id="simple" className="peer sr-only" />
                    <Label
                      htmlFor="simple"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 transition-all hover:shadow-md"
                    >
                      <FileText className="mb-4 h-8 w-8" />
                      <span className="text-base font-medium">{t("simpleFormat")}</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="sql" id="sql" className="peer sr-only" />
                    <Label
                      htmlFor="sql"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 transition-all hover:shadow-md"
                    >
                      <KeyRound className="mb-4 h-8 w-8" />
                      <span className="text-base font-medium">{t("sqlFormat")}</span>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="grid gap-2">
                  <Label htmlFor="tableStructure" className="text-sm font-medium">{t("tableStructure")}</Label>
                  <Textarea
                    id="tableStructure"
                    placeholder={
                      inputFormat === "simple"
                        ? t("inputPlaceholderSimple")
                        : t("inputPlaceholderSQL")
                    }
                    className="min-h-[240px] font-mono text-sm border-2 rounded-xl focus-visible:ring-primary shadow-inner bg-white dark:bg-gray-950"
                    value={tableStructure}
                    onChange={(e) => setTableStructure(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground italic">
                    {inputFormat === "simple"
                      ? t("formatHintSimple")
                      : t("formatHintSQL")}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/40 py-8 border-t border-border/40">
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-end gap-4 w-full sm:w-auto">
                  <div>
                    <Label htmlFor="recordCount" className="text-sm font-medium mb-2 block">{t("recordCount")}</Label>
                    <Input
                      id="recordCount"
                      type="number"
                      min="1"
                      max="100"
                      value={recordCount}
                      onChange={(e) => setRecordCount(Number.parseInt(e.target.value))}
                      className="w-[120px] border-2 focus-visible:ring-primary h-12 rounded-lg shadow-sm bg-white dark:bg-gray-950"
                    />
                  </div>
                  <Button 
                    onClick={generateMockData} 
                    disabled={isLoading} 
                    className="md:px-12 transition-all shadow-md hover:shadow-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg py-6 font-medium ml-2 flex-grow sm:flex-grow-0 rounded-xl animate-pulse-slow disabled:animate-none"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {isGenerating ? 
                          `${t("generating")} ${progressCount > 0 ? `(${progressCount}/${totalCount})` : ''}` : 
                          t("generating")}
                      </>
                    ) : (
                      <>
                        <Database className="mr-2 h-5 w-5" />
                        {t("generateButton")}
                      </>
                    )}
                  </Button>
                </div>
                {recordCount > 50 && (
                  <p className="text-sm text-yellow-700 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-2 sm:mt-0">
                    {t("largeDatasetWarning")}
                  </p>
                )}
              </div>
            </CardFooter>
          </Card>

          {mockData && (
            <Card className="md:col-span-2 border-2 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/40 border-b border-border/40">
                <div>
                  <CardTitle className="text-2xl font-semibold text-primary">{t("generatedDataTitle")}</CardTitle>
                  <CardDescription className="text-base">{t("generatedDataDesc")}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <Tabs defaultValue="json" className="w-full">
                  <TabsList className="mb-6 p-1 w-full justify-start gap-2 bg-muted/30 rounded-lg">
                    <TabsTrigger value="json" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5 py-2.5 rounded-md transition-all">
                      <Code className="h-4 w-4" />
                      JSON
                    </TabsTrigger>
                    <TabsTrigger value="table" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5 py-2.5 rounded-md transition-all">
                      <Table2 className="h-4 w-4" />
                      Table
                    </TabsTrigger>
                    <TabsTrigger value="sql" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5 py-2.5 rounded-md transition-all">
                      <Database className="h-4 w-4" />
                      SQL INSERT
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="json">
                    <div className="relative">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="absolute top-3 right-3 z-10 bg-background/90 hover:bg-accent transition-colors border shadow-sm flex items-center gap-1 rounded-lg" 
                        onClick={() => copyToClipboard(mockData)}
                      >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        {copied ? t("copied") : t("copy")}
                      </Button>
                      <pre className="bg-muted/30 p-4 rounded-lg overflow-auto max-h-[600px] text-sm border-2 pt-12 shadow-inner font-mono">
                        {mockData}
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="table">
                    <div className="overflow-auto max-h-[600px] border-2 rounded-lg shadow-inner">
                      <JsonTable data={mockData} />
                    </div>
                  </TabsContent>
                  <TabsContent value="sql">
                    <div className="relative overflow-hidden rounded-lg border-2 shadow-inner">
                      <SqlInsertStatements 
                        data={mockData} 
                        onCopy={copySqlToClipboard} 
                        copied={sqlCopied} 
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="container mx-auto py-8 border-t mt-10 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-muted-foreground">{t("footer")}</p>
          <p className="text-sm text-muted-foreground">{t("poweredBy")}</p>
        </div>
      </footer>
      <Toaster />
    </div>
  )
}

interface JsonTableProps {
  data: string | unknown;
}

function JsonTable({ data }: JsonTableProps) {
  const { t } = useLanguage();
  
  try {
    const jsonData = typeof data === "string" ? JSON.parse(data) : data
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      return <p className="p-6 text-center text-muted-foreground">{t("noData")}</p>
    }

    const columns = Object.keys(jsonData[0])

    return (
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/70">
              {columns.map((column) => (
                <th key={column} className="p-3 text-left font-semibold text-sm sticky top-0 bg-muted/90 backdrop-blur-sm">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jsonData.map((row, i) => (
              <tr 
                key={i} 
                className={`border-b last:border-0 hover:bg-muted/40 transition-colors ${
                  i % 2 === 0 ? "bg-white/70 dark:bg-gray-950/70" : "bg-muted/20"
                }`}
              >
                {columns.map((column) => (
                  <td key={`${i}-${column}`} className="p-3 text-sm">
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
    return <p className="p-6 text-center text-destructive bg-destructive/10 rounded-lg">{t("errorDisplayTable")} {error instanceof Error ? error.message : String(error)}</p>
  }
}

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
      return <p className="p-6 text-center text-muted-foreground">{t("noData")}</p>
    }

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

    const formattedSql = sqlStatements.replace(
      /(INSERT INTO|VALUES)/g,
      '<span class="text-primary font-bold">$1</span>'
    );

    return (
      <div className="relative">
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-3 right-3 z-10 bg-background/90 hover:bg-accent transition-colors border shadow-sm flex items-center gap-1 rounded-lg" 
          onClick={() => onCopy && onCopy(sqlStatements)}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          {copied ? t("copied") : t("copy")}
        </Button>
        <div className="bg-muted/30 p-4 rounded-md overflow-auto max-h-[600px] text-sm font-mono border-0 pt-12 shadow-inner">
          <div dangerouslySetInnerHTML={{ __html: formattedSql }} />
        </div>
      </div>
    );
  } catch (error) {
    return <p className="p-6 text-center text-destructive bg-destructive/10 rounded-lg">{t("errorSqlGeneration")} {error instanceof Error ? error.message : String(error)}</p>
  }
}

