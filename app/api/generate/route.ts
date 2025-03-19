import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { sanitizeInput } from "./utils"

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment variables")
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const { tableStructure, recordCount, inputFormat, language } = await req.json()

    if (!tableStructure) {
      return NextResponse.json({ error: "Table structure is required" }, { status: 400 })
    }

    const count = recordCount || 5
    const sanitizedStructure = sanitizeInput(tableStructure)
    const userLanguage = language || "en" // Default to English if language is not provided

    const prompt = `
      You are an AI assistant specialized in understanding database schemas and generating mock data.

      Given the following table structure:
      ${sanitizedStructure}

      Please perform the following tasks:
      1. Analyze and understand the table structure, regardless of its format (it could be a simple list of columns, a SQL CREATE TABLE statement, or any other common format for describing table structures).
      2. Generate ${count} records of mock data based on your understanding of the table structure.
      3. Return the mock data as a valid JSON array, where each object in the array represents a record with fields from the table structure.

      Guidelines for generating mock data:
      - Ensure the data is realistic and varied.
      - Use ISO format (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS) for date and datetime fields.
      - For numeric fields, generate appropriate numeric values.
      - If the table structure includes any comments or constraints (e.g., specific formats, value ranges, or predefined options), adhere to those in the generated data.
      - For any fields that might represent names, emails, or other personal information, use realistic but obviously fake data.
      - IMPORTANT: Generate all text content (names, addresses, descriptions, etc.) in the "${userLanguage}" language. If the language is "zh-CN", use Chinese names, addresses and text. If the language is "en", use English content.

      Return ONLY the JSON array of mock data, without any additional explanation, markdown formatting, or code blocks.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    let jsonData
    try {
      // First, try to parse the entire response as JSON
      jsonData = JSON.parse(text)
    } catch (error) {
      // If that fails, try to extract JSON from the text
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        try {
          jsonData = JSON.parse(jsonMatch[0])
        } catch (innerError) {
          console.error("Error parsing extracted JSON:", innerError)
          return NextResponse.json({ error: "Failed to parse extracted JSON from AI response" }, { status: 500 })
        }
      } else {
        console.error("No valid JSON found in the response")
        return NextResponse.json({ error: "No valid JSON found in AI response" }, { status: 500 })
      }
    }

    return NextResponse.json({ mockData: jsonData })
  } catch (error: unknown) {
    console.error("Error generating mock data:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to generate mock data"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

