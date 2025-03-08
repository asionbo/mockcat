# MockCat: AI-Powered Mock Data Generator

[English](README.md) | [简体中文](README.zh-CN.md)

MockCat is a full-stack application that helps you generate realistic mock data based on your table structure using Gemini AI.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file with your Gemini API key and other necessary credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **AI-Powered Data Generation**: Uses Gemini AI to create contextually relevant data based on your schema
- **Multiple Output Formats**: Export your mock data as JSON, CSV, SQL, or directly to supported databases
- **Schema Import**: Import your existing database schema or define it manually
- **Data Relationships**: Support for foreign key relationships to maintain data integrity
- **Customizable Templates**: Save your generation configurations for future use

## Usage

1. Define your table structure through the UI or import from an existing schema
2. Configure generation settings (number of records, data distributions, etc.)
3. Generate your mock data
4. Preview and adjust as needed
5. Export in your preferred format

## Technologies

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **AI Integration**: Google Gemini API
- **Database**: MongoDB (for storing templates and user preferences)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgements

- Google Gemini AI for providing the underlying language model capabilities
- Contributors and open source projects that made this possible