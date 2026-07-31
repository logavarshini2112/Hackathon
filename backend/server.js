import app from './app.js';
import dotenv from 'dotenv';
import { checkDatabaseConnection } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start Server & Check DB Connection
async function startServer() {
  await checkDatabaseConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Visitor Feedback Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
  });
}

startServer();
