# Blog Management System - Phases 1 & 2

A robust backend application that scrapes blog articles, enhances them using AI, stores them in a MySQL database, and exposes RESTful APIs for content management. Built with Node.js, Express, Puppeteer, and Gemini AI.

## 🚀 Features

### Phase 1: Scraping & Backend
- **Automated Scraping**: Intelligent scraper using Puppeteer to navigate pagination and extract the 5 oldest articles from [BeyondChats](https://beyondchats.com/blogs/).
- **Data Persistence**: Stores articles in MySQL with duplicate prevention logic.
- **REST API**: Full CRUD capabilities for article management.
- **Clean Architecture**: Modular structure separating controllers, services, models, and configuration.

### Phase 2: AI Content Enhancement (Automation)
- **Automated Research**: Automatically searches Google for article topics using Puppeteer.
- **Smart Filtering**: Selects top 2 organic results (excluding ads, social media, PDFs) as references.
- **Contextual Scraping**: Extracts headings and content structure from reference articles.
- **AI Rewriting**: Uses **Google Gemini 2.0 Flash** to rewrite articles for better SEO, structure, and readability without plagiarism.
- **Auto-Update**: Automatically updates the database with the enhanced content and reference links.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (Sequelize ORM)
- **Scraping**: Puppeteer (Headless Chrome)
- **AI/LLM**: Google Gemini 2.0 Flash API
- **HTTP Client**: Axios

## 📂 Project Structure

```
src/
├── config/         # Database configuration
├── controllers/    # Request handlers for API endpoints
├── models/         # Sequelize data models (Article schema)
├── routes/         # API route definitions
├── scripts/        # Utility scripts (Database initialization)
├── services/       # Business logic
│   ├── scraperService.js  # Phase 1: Blog Scraper
│   └── aiEnhancer.js      # Phase 2: AI Automation
└── app.js          # Application entry point
```

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (Running via XAMPP or standalone service)
- **Gemini API Key** (Required for Phase 2)

## ⚙️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd "BeyoundChats Assignment"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Create or update `.env` file:
     ```env
     PORT=3000
     DB_HOST=127.0.0.1
     DB_USER=root
     DB_PASS=
     DB_NAME=blog_scraper
     DB_DIALECT=mysql
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. **Initialize Database**
   ```bash
   node src/scripts/initDb.js
   ```

## 🏃 Usage

### 1. Run the Scraper (Phase 1)
To scrape the oldest articles and populate the database:
```bash
npm run scrape
```

### 2. Run AI Enhancer (Phase 2)
To research and rewrite pending articles using AI:
```bash
npm run enhance
```
*Note: This requires the API server to be running.*

### 3. Start the API Server
To launch the REST API server:
```bash
npm start
```
The server will start on `http://localhost:3000`.

## 🔌 API Documentation

### Base URL
`http://localhost:3000`

### Endpoints

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| `GET` | `/articles` | Retrieve all articles | `page`, `limit` |
| `GET` | `/articles/:id` | Get a specific article | - |
| `POST` | `/articles` | Create a new article | - |
| `PUT` | `/articles/:id` | Update an article | - |
| `DELETE` | `/articles/:id` | Delete an article | - |

## 🛡️ License

This project is part of the BeyondChats assignment.
