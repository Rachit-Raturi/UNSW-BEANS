import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import { messageSend } from './message';
import config from './config.json';
import cors from 'cors';

import { authLoginV1, authRegisterV1, authLogoutV1 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1 } from './channel';
import { userProfileV1, usersAllV1, userSetNameV1, userSetHandleV1, userSetEmailV1 } from './users';
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

app.post('/auth/login/v2', (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json(authLoginV1(email, password));
});

app.post('/auth/register/v2', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(authRegisterV1(email, password, nameFirst, nameLast));
});

app.post('/auth/logout/v1', (req: Request, res: Response) => {
  const { token } = req.body;
  res.json(authLogoutV1(token));
});

app.delete('/clear/v1', (req: Request, res: Response) => {
  res.json(clearV1());
});

// Channel functions
app.get('/channels/list/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  res.json(channelsListV1(token));
});

app.post('/channel/invite/v2', (req: Request, res: Response) => {
  console.log('Message Sent');
  const { token, channelId, uId } = req.body;
  res.json(channelInviteV1(token, channelId, uId));
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

app.get('/channel/messages/v2', (req: Request, res: Response) => {
  console.log('Message History');
  const { token, channelId, start } = req.body;
  res.json(channelMessagesV1(token, channelId, start));
});

// Channels functions

app.post('/channels/create/v2', (req: Request, res: Response) => {
  console.log('Channel Created');
  const { token, name, isPublic } = req.body;
  res.json(channelsCreateV1(token, name, isPublic));
});

app.get('/channels/listAll/v2', (req: Request, res: Response) => {
  console.log('Channels List All');
  const token = req.query.token as string; 
  res.json(channelsListAllV1(token));
});

// User/s functions
app.get('/user/profile/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const uId = parseInt(req.query.uId as string);
  res.json(userProfileV1(token, uId));
});

app.get('/users/all/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  res.json(usersAllV1(token));
});

app.put('/user/profile/setname/v1', (req: Request, res: Response) => {
  const { token, nameFirst, nameLast } = req.body;
  res.json(userSetNameV1(token, nameFirst, nameLast));
});

app.put('/user/profile/setemail/v1', (req: Request, res: Response) => {
  const { token, email } = req.body;
  res.json(userSetEmailV1(token, email));
});

app.put('/user/profile/sethandle/v1', (req: Request, res: Response) => {
  const { token, handleStr } = req.body;
  res.json(userSetHandleV1(token, handleStr));
});
// ========================================================================= //