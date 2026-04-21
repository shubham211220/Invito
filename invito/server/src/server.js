const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', env.UPLOAD_DIR);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`\n🎉 Invito API Server running on port ${env.PORT}`);
      console.log(`📍 Environment: ${env.NODE_ENV}`);
      console.log(`🌐 Client URL: ${env.CLIENT_URL}`);
      console.log(`💾 Health check: http://localhost:${env.PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
