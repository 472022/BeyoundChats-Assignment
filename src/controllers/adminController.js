const { exec } = require('child_process');
const path = require('path');

const executeScript = (scriptName, res) => {
  const scriptPath = path.join(__dirname, `../services/${scriptName}`);
  
  // Execute the node script
  exec(`node "${scriptPath}"`, { timeout: 300000 }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ${scriptName}:`, error);
      return res.status(500).json({ 
        success: false, 
        message: `Execution failed: ${error.message}`,
        logs: stderr 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Process completed successfully',
      logs: stdout 
    });
  });
};

exports.runScraper = (req, res) => {
  console.log('Admin triggered: Scraper');
  executeScript('runScraper.js', res);
};

exports.runEnhancer = (req, res) => {
  console.log('Admin triggered: AI Enhancer');
  executeScript('aiEnhancer.js', res);
};
