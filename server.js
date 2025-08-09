const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const port = 8080;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.createReadStream('index.html').pipe(res);
  } else {
    res.writeHead(404);
    res.end();
  }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  ws.on('message', message => {
    // Рассылаем всем клиентам
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
