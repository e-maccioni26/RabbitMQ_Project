const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(bodyParser.json());
app.use(cors());

let messages = [];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const message = req.body;
  messages.push(message);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
  res.sendStatus(200);
});

wss.on('connection', ws => {
  console.log('Client connected');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
