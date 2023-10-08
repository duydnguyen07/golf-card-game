/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { deal9Cards } from './card-dealer';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/deal', (req, res) => {
  res.status(200).json(deal9Cards(3, 4))
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
