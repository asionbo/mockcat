import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { sanitizeInput } from "./utils"

// Maximum number of records to generate in a single batch
const MAX_BATCH_SIZE = 20;

async function generateDataBatch(
  model: any, 
  tableStructure: string, 
  batchSize: number, 
  language: string
): Promise<any[]> {
  const prompt = `
    You are an AI assistant specialized in understanding database schemas and generating mock data.

    Given the following table structure:
    ${tableStructure}

    Please perform the following tasks:
    1. Analyze and understand the table structure, regardless of its format (it could be a simple list of columns, a SQL CREATE TABLE statement, or any other common format for describing table structures).
    2. Generate ${batchSize} records of mock data based on your understanding of the table structure.
    3. Return the mock data as a valid JSON array, where each object in the array represents a record with fields from the table structure.

    Guidelines for generating mock data:
    - Ensure the data is realistic, varied, and consistent.
    - Use ISO format (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS) for date and datetime fields.
    - For numeric fields, generate appropriate numeric values within reasonable ranges.
    - For any fields that might represent names, emails, or other personal information, use realistic but obviously fake data.
    - IMPORTANT: Generate all text content (names, addresses, descriptions, etc.) in the "${language}" language. If the language is "zh-CN", use Chinese names, addresses and text. If the language is "en", use English content.
    - Focus on accuracy and consistency rather than creativity - ensure all field names exactly match those in the table structure.
    - If the field appears to be an ID or primary key, ensure values are unique integers.

    Return ONLY the JSON array of mock data, without any additional explanation, markdown formatting, or code blocks.
  `

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  try {
    // First, try to parse the entire response as JSON
    return JSON.parse(text)
  } catch (error) {
    // If that fails, try to extract JSON from the text
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error("No valid JSON found in AI response")
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment variables")
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.2,  // Lower temperature for more consistent results
        maxOutputTokens: 8192,  // Ensure we have enough tokens for large responses
      }
    })

    const { tableStructure, recordCount, inputFormat, language } = await req.json()

    if (!tableStructure) {
      return NextResponse.json({ error: "Table structure is required" }, { status: 400 })
    }

    const count = Math.min(recordCount || 5, 200) // Limiting max records to 200 for safety
    const sanitizedStructure = sanitizeInput(tableStructure)
    const userLanguage = language || "en" // Default to English if language is not provided

    // Generate data in batches
    let allData: any[] = []
    let remainingCount = count
    
    while (remainingCount > 0) {
      const batchSize = Math.min(remainingCount, MAX_BATCH_SIZE)
      
      try {
        // Add retry mechanism for reliability
        let attempts = 0
        let batchData = []
        const maxAttempts = 3
        
        while (attempts < maxAttempts) {
          try {
            batchData = await generateDataBatch(model, sanitizedStructure, batchSize, userLanguage)
            break // If successful, exit retry loop
          } catch (error) {
            attempts++
            if (attempts >= maxAttempts) throw error // Re-throw if all attempts failed
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts))
          }
        }
        
        // Ensure we have array data and it's the correct size
        if (Array.isArray(batchData) && batchData.length > 0) {
          allData = [...allData, ...batchData]
          remainingCount -= batchData.length
        } else {
          throw new Error("Generated batch data is not a valid array")
        }
      } catch (error) {
        console.error("Error generating batch:", error)
        // If we already have some data, return what we have instead of failing completely
        if (allData.length > 0) {
          remainingCount = 0 // Stop trying to generate more
        } else {
          throw error // Re-throw if we haven't generated any data yet
        }
      }
    }

    return NextResponse.json({ 
      mockData: allData,
      generatedCount: allData.length,
      requestedCount: count
    })
  } catch (error: unknown) {
    console.error("Error generating mock data:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to generate mock data"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

