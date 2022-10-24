import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import { messageSend } from './message';
import config from './config.json';
import cors from 'cors';

import { authLoginV1, authRegisterV1, authLogoutV1 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1 } from './channel';
import { clearV1 } from './other';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

// Example get request
app.get('/echo', (req: Request, res: Response, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

// for logging errors (print to terminal)
app.use(morgan('dev'));

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});

app.get('/channel/details/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const channelId = parseInt(req.query.channelId as string);
  res.json(channelDetailsV1(token, channelId));
});

app.post('/message/send/v1', (req: Request, res: Response) => {
  console.log('Message Sent');

  const { token, channelId, message } = req.body;

  res.json(messageSend(token, channelId, message));
});

app.post('/auth/login/v2', (req: Request, res: Response) => {

  const { email, password } = req.body;

  res.json(authLoginV1(email, password));
});

app.post('/auth/register/v2', (req: Request, res: Response) => {

  const { email, password, nameFirst, nameLast } = req.body;

  res.json(authRegisterV1(email, password, nameFirst, nameLast));
});

app.post('/auth/login/v2', (req: Request, res: Response) => {

  const { token } = req.body;

  res.json(authLogoutV1(token));
});

app.delete('/clear/v1', (req: Request, res: Response) => {
  res.json(clearV1());
});