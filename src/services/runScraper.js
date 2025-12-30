const { scrapeBlogs } = require('./scraperService');
const sequelize = require('../config/database');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connected for scraping...');
    await sequelize.sync(); // Ensure tables exist
    
    await scrapeBlogs();
    
    console.log('Scraping process finished.');
    process.exit(0);
  } catch (error) {
    console.error('Scraping failed:', error);
    process.exit(1);
  }
}

run();
