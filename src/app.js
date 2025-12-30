const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const articleRoutes = require('./routes/articleRoutes');
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/articles', articleRoutes);
app.use('/admin', adminRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Blog Scraper API is running');
});

// Database Sync & Server Start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    
    // Sync models (alter: true updates the schema to match the model)
    await sequelize.sync({ alter: true }); 
    console.log('Database synced...');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
