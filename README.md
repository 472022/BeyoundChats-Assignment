# Blog Management System - Phase 1

A robust backend application that scrapes blog articles from [BeyondChats](https://beyondchats.com/blogs/), stores them in a MySQL database, and exposes RESTful APIs for content management. Built with Node.js, Express, and Puppeteer.

## 🚀 Features

- **Automated Scraping**: Intelligent scraper using Puppeteer to navigate pagination and extract the 5 oldest articles.
- **Data Persistence**: Stores articles in MySQL with duplicate prevention logic.
- **REST API**: Full CRUD capabilities for article management.
- **Clean Architecture**: Modular structure separating controllers, services, models, and configuration.
- **Database ORM**: Uses Sequelize for efficient and secure database interactions.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Scraping**: Puppeteer (Headless Chrome)
- **Environment**: Dotenv for configuration management

## 📂 Project Structure

```
src/
├── config/         # Database configuration
├── controllers/    # Request handlers for API endpoints
├── models/         # Sequelize data models (Article schema)
├── routes/         # API route definitions
├── scripts/        # Utility scripts (Database initialization)
├── services/       # Business logic (Scraper implementation)
└── app.js          # Application entry point
```

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (Running via XAMPP or standalone service)

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
   - The project uses a `.env` file for configuration.
   - Ensure `DB_HOST`, `DB_USER`, `DB_PASS`, and `DB_NAME` match your MySQL setup.
   - Default configuration assumes XAMPP defaults (User: `root`, No Password).

4. **Initialize Database**
   - Ensure your MySQL server is running.
   - Run the initialization script to create the database:
     ```bash
     node src/scripts/initDb.js
     ```

## 🏃 Usage

### 1. Run the Scraper
To scrape the oldest articles and populate the database:
```bash
npm run scrape
```

### 2. Start the Server
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

### Sample Request (Create Article)
**POST** `/articles`
```json
{
  "title": "New Blog Post",
  "original_content_text": "This is the content...",
  "source_url": "https://example.com/post"
}
```

## 🛡️ License

This project is part of the BeyondChats assignment.
