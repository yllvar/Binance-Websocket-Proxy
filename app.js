require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const { setupWebSocket } = require('./services/ws');
const apiRoutes = require('./routes');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'connect-src': [
        "'self'", 
        process.env.NODE_ENV === 'production' 
          ? 'wss://qubit-proxy.fly.dev' 
          : 'ws://localhost:8080'
      ]
    }
  }
}));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(',')
}));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    service: 'Qubit Proxy',
    status: 'operational',
    version: process.env.npm_package_version
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// WebSocket setup
setupWebSocket(server);

// Start server
server.listen(process.env.PORT || 8080, '0.0.0.0', () => {
  console.log(`Server running on port ${process.env.PORT || 8080}`);
});
