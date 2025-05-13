# Binance WebSocket Proxy ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/yllvar/Binance-Websocket-Proxy/ci.yml) ![npm](https://img.shields.io/npm/v/ws) [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

A performance-ready WebSocket proxy for Binance API with rate limiting and authentication.

## Features
- Real-time market data streaming via WebSocket
- JWT-based authentication
- Request rate limiting
- CORS support
- HTTPS/WebSocket security headers
- Load balancing ready

## Installation
```bash
git clone https://github.com/yllvar/Binance-Websocket-Proxy.git
cd Binance-Websocket-Proxy
npm install
```

## Configuration
Create `.env` file:
```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
BINANCE_WS_URL=wss://stream.binance.com:9443/ws
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
NODE_ENV=development
```

## API Documentation

### WebSocket Proxy
`ws://localhost:3000/ws/{stream}`

```javascript
const ws = new WebSocket('ws://localhost:3000/ws/btcusdt@trade');
```

### REST API
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth`  | POST   | Get JWT token |
| `/health`| GET    | Service status |

## Running
```bash
# Development
npm run dev

# Production
npm start
```

## Testing
```bash
npm test
```

## Deployment
Configured for Fly.io deployment:
```bash
fly launch
fly deploy
```

## Contributing
Pull requests welcome. For major changes, please open an issue first.

## License
[MIT](https://choosealicense.com/licenses/mit/)
