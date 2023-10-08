/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { deal9Cards } from './card-dealer';
import expressWs from 'express-ws';
import { WebSocket } from 'ws';

const app = express();
var expressWsInstance = expressWs(app);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/deal', (req, res) => {
  res.status(200).json(deal9Cards(3, 4));
});

expressWsInstance.app.ws('/ws', function (ws, req) {
  ws.on('message', function (msg) {
    console.log(msg);

    expressWsInstance.getWss().clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });
});

expressWsInstance.getWss().on('connection',(e) => {
  console.log(e)
})

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
