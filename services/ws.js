const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const connections = new Map();

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ 
    server,
    host: '0.0.0.0' // Explicitly bind to all network interfaces
  });

  wss.on('connection', (ws, req) => {
    const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');
    
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return ws.close(1008, 'Unauthorized');
    }

    const clientId = Date.now().toString();
    connections.set(clientId, ws);

    ws.on('message', (message) => {
      console.log('Received:', message);
    });

    ws.on('close', () => {
      connections.delete(clientId);
    });
  });

  // Broadcast to all clients
  const broadcast = (data) => {
    connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  };

  return { broadcast };
};

module.exports = { setupWebSocket };
