const axios = require('axios');
const puppeteer = require('puppeteer');
require('dotenv').config();

const API_BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- Helper Functions ---

// 1. Google Search & Filter
async function searchAndGetReferences(title, browser) {
  const page = await browser.newPage();
  const references = [];
  
  try {
    console.log(`Searching Google for: "${title}"`);
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(title)}`, { waitUntil: 'domcontentloaded' });

    // Extract organic results
    const results = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('div.g a')); // Standard Google result selector
      return anchors.map(a => a.href)
        .filter(href => href && href.startsWith('http'))
        .filter(href => !href.includes('google.com') && !href.includes('youtube.com') && !href.includes('facebook.com') && !href.includes('reddit.com') && !href.includes('quora.com') && !href.endsWith('.pdf'));
    });

    // Get top 2 unique domains
    const uniqueDomains = new Set();
    const targetUrls = [];
    
    for (const url of results) {
      try {
        const domain = new URL(url).hostname;
        if (!uniqueDomains.has(domain)) {
          uniqueDomains.add(domain);
          targetUrls.push(url);
        }
        if (targetUrls.length >= 2) break;
      } catch (e) { continue; }
    }

    console.log('Selected Reference URLs:', targetUrls);

    // Scrape Content from References
    for (const url of targetUrls) {
      try {
        console.log(`Scraping reference: ${url}`);
        const refPage = await browser.newPage();
        await refPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        const content = await refPage.evaluate(() => {
          // Extract headings and paragraphs
          const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText).join('\n');
          const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.innerText).join('\n');
          return `HEADINGS:\n${headings}\n\nCONTENT:\n${paragraphs}`.substring(0, 5000); // Limit context
        });
        
        references.push({ url, content });
        await refPage.close();
      } catch (err) {
        console.error(`Failed to scrape ${url}:`, err.message);
      }
    }

  } catch (error) {
    console.error('Search failed:', error.message);
  } finally {
    await page.close();
  }
  
  return references;
}

// 2. Call Gemini API
async function rewriteContent(originalContent, referenceData) {
  const refContext = referenceData.map((ref, i) => `--- REFERENCE ${i+1} ---\n${ref.content}`).join('\n\n');
  
  const prompt = `
  Rewrite the given article by improving structure, SEO, and readability.
  Follow the tone and formatting style of the reference articles provided below.
  Do not copy sentences directly from references.
  Produce original, high-quality content.
  Add relevant headings and subheadings.
  
  --- REFERENCE MATERIAL ---
  ${refContext}
  
  --- ORIGINAL ARTICLE ---
  ${originalContent}
  
  OUTPUT (Markdown):
  `;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate content');
  }
}

// --- Main Workflow ---

async function runEnhancer() {
  console.log('Starting AI Enhancer...');
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox'] 
  });

  try {
    // 1. Fetch Articles
    const { data: allArticles } = await axios.get(`${API_BASE_URL}/articles?limit=100`); // Fetch a batch
    const pendingArticles = allArticles.articles.filter(a => !a.is_updated);

    console.log(`Found ${pendingArticles.length} articles to enhance.`);

    for (const article of pendingArticles) {
      console.log(`\nProcessing Article ID ${article.id}: "${article.title}"`);
      
      // 2. Research
      const references = await searchAndGetReferences(article.title, browser);
      
      if (references.length === 0) {
        console.warn('Skipping: No valid references found.');
        continue;
      }

      // 3. Rewrite
      console.log('Generating AI content...');
      const updatedText = await rewriteContent(article.original_content_text || article.original_content_html, references);
      
      // 4. Update Backend
      const updatePayload = {
        updated_content: updatedText,
        references: references.map(r => r.url),
        is_updated: true
      };

      await axios.put(`${API_BASE_URL}/articles/${article.id}`, updatePayload);
      console.log(`Successfully updated Article ${article.id}`);
    }

  } catch (error) {
    console.error('Enhancer Workflow Error:', error.message);
  } finally {
    await browser.close();
    console.log('Enhancement process finished.');
  }
}

// Run if executed directly
if (require.main === module) {
  runEnhancer();
}

module.exports = { runEnhancer };
