# Full-Stack AI Blog Management System 🤖✨

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![Database](https://img.shields.io/badge/Database-SQLite%20(Sequelize)-orange)
![AI](https://img.shields.io/badge/AI-Google%20Gemini%202.0-purple)

A sophisticated full-stack application that automates the entire lifecycle of blog content management. From scraping legacy content to enhancing it with AI, categorizing it intelligently, and presenting it in a modern, responsive UI.

---

## 📸 Project Screenshots

### 1. Simulation Dashboard
The command center for triggering background processes. Watch the AI scrape, research, and rewrite articles in real-time.
![Dashboard Screenshot](./images/Screenshot%202025-12-30%20210339.png)

### 2. Article Detail View (AI Enhanced)
Toggle between the original scraped content and the AI-rewritten version with professional Markdown formatting.
![Article Detail Screenshot](./images/Screenshot%202025-12-30%20210305.png)

---

## 🚀 Key Features

### 🔹 Phase 1: Automated Scraping
- **Intelligent Scraper:** Uses Puppeteer to navigate pagination and extract the 5 oldest articles from [BeyondChats](https://beyondchats.com/blogs/).
- **Duplicate Prevention:** Smart logic ensures the same article isn't saved twice.
- **Robust Storage:** Persists data reliably using Sequelize and SQLite.

### 🔹 Phase 2: AI Enhancement & Research
- **Automated Research:** Before rewriting, the system Googles the article topic to find credible sources (filtering out ads, social media, and PDFs).
- **Contextual Rewriting:** Uses **Google Gemini 2.0 Flash** to rewrite the article, improving SEO, structure, and readability while maintaining the original tone.
- **Citation Generation:** Automatically appends a "References" section with the links used for research.

### 🔹 Phase 3: Smart Categorization
- **Auto-Classification:** The AI analyzes the content and assigns it a category (e.g., *Technology, Business, Health, Lifestyle*).
- **Dynamic Filtering:** The frontend automatically generates filter chips based on the available categories.

### 🔹 Phase 4: Modern Frontend Experience
- **Interactive UI:** Built with React, Vite, and Tailwind CSS.
- **Markdown Rendering:** Renders enhanced content with proper headings, lists, and formatting.
- **Live Simulation:** A dedicated Dashboard to trigger backend scripts via API and view live execution logs.

---

## 🛠️ Technical Architecture

### Backend (`/src`)
- **Runtime:** Node.js & Express
- **Database:** SQLite (Zero-config, file-based)
- **ORM:** Sequelize
- **Services:**
    - `scraperService.js`: Puppeteer logic.
    - `aiEnhancer.js`: Gemini API & Google Search integration.
    - `adminController.js`: Manages script execution via child processes.

### Frontend (`/frontend`)
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **State Management:** React Hooks
- **HTTP Client:** Axios

---

## ⚙️ Installation & Setup Guide

### Prerequisites
- Node.js (v16+)
- NPM or Yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "BeyoundChats Assignment"
```

### 2. Backend Configuration
Install dependencies and set up your environment variables.

```bash
# Install backend dependencies
npm install

# Create a .env file in the root directory
# Add your Gemini API Key (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Frontend Configuration
Navigate to the frontend folder and install its dependencies.

```bash
cd frontend
npm install
```

---

## 🏃 How to Run the Project

You need to run **two terminals** simultaneously.

### Terminal 1: Start Backend Server
```bash
# From root directory
npm start
```
*The server will start on `http://localhost:3000` and sync the database.*

### Terminal 2: Start Frontend Application
```bash
# From root directory
cd frontend
npm run dev
```
*The app will be accessible at `http://localhost:5173`.*

---

## 🎮 Usage Walkthrough

1.  **Open the App:** Go to **http://localhost:5173**.
2.  **Go to Dashboard:** Click the "Dashboard" link in the top navigation bar.
3.  **Step 1 - Scrape:**
    *   Click the **"Start Scraper"** button.
    *   Watch the console log as it visits BeyondChats and extracts articles.
4.  **Step 2 - Enhance:**
    *   Click the **"Start AI Enhancement"** button.
    *   The system will process pending articles, research them on Google, and use Gemini to rewrite/categorize them.
5.  **Step 3 - Explore:**
    *   Go back to the **"Articles"** page.
    *   Use the category filters to browse.
    *   Click an article to read the **Enhanced Version** (default) or toggle to the **Original**.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/articles` | Retrieve all articles (pagination supported) |
| `GET` | `/articles/:id` | Get details for a single article |
| `POST` | `/admin/scrape` | Trigger the background scraping process |
| `POST` | `/admin/enhance` | Trigger the AI research & rewrite process |

---

## 🛡️ License
This project was built for the BeyondChats assignment.
