require('dotenv').config();
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { setupWebSocket } = require('../services/ws');

describe('WebSocket Server', () => {
  let server;
  let wss;

  beforeAll((done) => {
    const http = require('http');
    server = http.createServer();
    wss = setupWebSocket(server);
    server.listen(3002, done);
  });

  afterAll((done) => {
    jest.setTimeout(10000);
    server.close(() => {
      // Ensure all WebSocket connections are closed
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.terminate();
        }
      });
      done();
    });
  });

  it('should reject connections without valid JWT token', (done) => {
    jest.setTimeout(1000000);
    const ws = new WebSocket('ws://localhost:3002?token=invalid');
    
    ws.on('close', (code, reason) => {
      expect(code).toBe(1008);
      expect(Buffer.from(reason).toString()).toBe('Unauthorized');
      done();
    });
  });

  it('should accept connections with valid JWT token', (done) => {
    jest.setTimeout(100000);
    const token = jwt.sign({ userId: 'test' }, process.env.JWT_SECRET);
    const ws = new WebSocket(`ws://localhost:3002?token=${token}`);
    
    ws.on('open', () => {
      expect(ws.readyState).toBe(WebSocket.OPEN);
      ws.close();
      done();
    });
  });

  it('should broadcast messages to all clients', (done) => {
    jest.setTimeout(10000);
    const token = jwt.sign({ userId: 'test' }, process.env.JWT_SECRET);
    const ws1 = new WebSocket(`ws://localhost:3002?token=${token}`);
    const ws2 = new WebSocket(`ws://localhost:3002?token=${token}`);
    
    let messagesReceived = 0;
    const testMessage = { type: 'test', data: 'hello' };

    ws1.on('open', () => {
      ws2.on('message', (data) => {
        expect(JSON.parse(data)).toEqual(testMessage);
        if (++messagesReceived === 2) done();
      });

      wss.broadcast(testMessage);
    });
  });
});
