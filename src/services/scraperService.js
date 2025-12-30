const puppeteer = require('puppeteer');
const Article = require('../models/Article');

async function scrapeBlogs() {
  console.log('Starting scraper...');
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    // 1. Navigate to main blog page
    await page.goto('https://beyondchats.com/blogs/', { waitUntil: 'domcontentloaded' });
    
    // 2. Find Last Page
    // Attempt to find pagination controls
    let lastPageLink = await page.evaluate(() => {
      // Common pagination selectors
      const pageLinks = Array.from(document.querySelectorAll('.pagination a, .page-numbers a, .nav-links a'));
      if (pageLinks.length === 0) return null;
      
      // Filter for links that are numbers
      const numberLinks = pageLinks.filter(link => !isNaN(parseInt(link.innerText)));
      if (numberLinks.length > 0) {
        // Return the href of the last numbered link (usually the highest number)
        return numberLinks[numberLinks.length - 1].href;
      }
      return null;
    });

    if (lastPageLink) {
      console.log(`Navigating to last page: ${lastPageLink}`);
      await page.goto(lastPageLink, { waitUntil: 'domcontentloaded' });
    } else {
      console.log('No pagination found, assuming single page.');
    }

    // 3. Get Article Links
    // On the last page, we want the *oldest* articles.
    // Usually, on the last page, the bottom-most article is the oldest of all? 
    // Or if it's "Page N", the articles on Page N are older than Page 1.
    // Within Page N, usually the top one is newer than the bottom one.
    // So we should grab articles from the bottom up.
    
    const articleUrls = await page.evaluate(() => {
      // Selectors for article links (h2 a, h3 a, .post-title a)
      const selectors = [
        'article h2 a', 
        'article h3 a', 
        '.post-title a', 
        '.entry-title a',
        '.blog-post a.title'
      ];
      
      let links = [];
      for (let sel of selectors) {
        links = Array.from(document.querySelectorAll(sel)).map(a => a.href);
        if (links.length > 0) break;
      }
      return links;
    });

    console.log(`Found ${articleUrls.length} articles on the last page.`);
    
    // We need 5 oldest. If last page has < 5, we might need the previous page.
    // For simplicity, let's take up to 5 from the bottom of the list on the last page.
    // If we need more, we'd need to go to (lastPage - 1).
    // Let's reverse to get oldest first (assuming page order is new->old top->bottom)
    let targetUrls = articleUrls.reverse().slice(0, 5);
    
    if (targetUrls.length < 5 && lastPageLink) {
        // Logic to go to previous page could be added here, 
        // but for "Phase 1" minimal viable, we'll stick to what we found or just log warning.
        console.warn('Found fewer than 5 articles on the last page.');
    }

    console.log('Target URLs:', targetUrls);

    // 4. Scrape details for each article
    for (const url of targetUrls) {
      console.log(`Scraping: ${url}`);
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        
        const data = await page.evaluate(() => {
          const title = document.querySelector('h1, .entry-title, .post-title')?.innerText?.trim() || 'No Title';
          
          // Content
          const contentEl = document.querySelector('.entry-content, .post-content, article .content, .blog-content');
          const html = contentEl?.innerHTML || '';
          const text = contentEl?.innerText?.replace(/\s+/g, ' ').trim() || '';
          
          // Meta
          const author = document.querySelector('.author, .entry-author, .posted-by')?.innerText?.trim() || null;
          const dateStr = document.querySelector('time, .published, .date, .entry-date')?.getAttribute('datetime') 
                         || document.querySelector('time, .published, .date, .entry-date')?.innerText?.trim();
                         
          return { title, html, text, author, dateStr };
        });

        // Save to DB
        await Article.findOrCreate({
          where: { source_url: url },
          defaults: {
            title: data.title,
            original_content_html: data.html,
            original_content_text: data.text,
            author: data.author,
            published_date: data.dateStr ? new Date(data.dateStr) : new Date(),
            source_url: url
          }
        });
        
      } catch (err) {
        console.error(`Error scraping ${url}:`, err.message);
      }
    }
    
    console.log('Scraping completed.');

  } catch (error) {
    console.error('Main scraper error:', error);
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeBlogs };
