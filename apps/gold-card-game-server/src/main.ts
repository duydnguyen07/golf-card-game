/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { deal9Cards } from './card-dealer';
import expressWs from 'express-ws';
import { handleRoomSetup } from './room-manager';

const app = express();
var expressWsInstance = expressWs(app, null, {
    wsOptions: {
      maxPayload: 500000
    }
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/deal', (req, res) => {
  res.status(200).json(deal9Cards(3, 4));
});

expressWsInstance.app.ws('/ws', function (ws, req) {
  handleRoomSetup(ws)
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
