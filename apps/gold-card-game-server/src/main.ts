/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import expressWs from 'express-ws';
import { handleRoomSetup, ROOM_DATABASE } from './room-manager';
import { handleGameRuntime } from './game-referee';

const app = express();
var expressWsInstance = expressWs(app, null, {
    wsOptions: {
      maxPayload: 500000
    }
});
expressWsInstance.app.ws('/ws', function (ws, req) {
  handleRoomSetup(ws)
  handleGameRuntime(ws, ROOM_DATABASE)
});

app.use(express.static(path.join(__dirname, 'assets')));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));


const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
