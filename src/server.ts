import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import { messageSend, messageEdit, messageRemove } from './message';
import config from './config.json';
import cors from 'cors';
import fs from 'fs';
import { getData, setData } from './dataStore';


import { authLoginV1, authRegisterV1, authLogoutV1 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1, channelLeaveV1, channelAddOwnerV1, channelRemoveOwnerV1 } from './channel';
import { userProfileV1, usersAllV1, userSetNameV1, userSetHandleV1, userSetEmailV1 } from './users';
import { dmCreateV1, dmMessagesV1, messageSendDmV1 } from './dm';
import { clearV1 } from './other';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

if (fs.existsSync('./database.json')) {
  const dbstr = fs.readFileSync('./src/database.json');
  setData(JSON.parse(String(dbstr)));
}

const data = getData();
const save = () => {
  const jsonstr = JSON.stringify(data);
  fs.writeFileSync('./src/database.json', jsonstr);

}
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

// ========================================================================= 
// auth functions
app.post('/auth/login/v2', (req: Request, res: Response) => {
  const { email, password } = req.body;
  save();
  res.json(authLoginV1(email, password));
});

app.post('/auth/register/v2', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  save();
  res.json(authRegisterV1(email, password, nameFirst, nameLast));
});

app.post('/auth/logout/v1', (req: Request, res: Response) => {
  const { token } = req.body;
  save();
  res.json(authLogoutV1(token));
});

app.delete('/clear/v1', (req: Request, res: Response) => {
  save();
  res.json(clearV1());
});

// ========================================================================= 
// Channel functions
app.get('/channels/list/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  save();
  res.json(channelsListV1(token));
});

app.post('/channel/invite/v2', (req: Request, res: Response) => {
  const { token, channelId, uId } = req.body;
  save();
  res.json(channelInviteV1(token, channelId, uId));
});

app.post('/channel/join/v2', (req: Request, res: Response) => {
  const { token, channelId, } = req.body;
  save();
  res.json(channelJoinV1(token, channelId));
});

app.post('/channel/leave/v1', (req: Request, res: Response) => {
  const { token, channelId } = req.body;
  save();
  res.json(channelLeaveV1(token, channelId));
});

app.post('/channel/addowner/v1', (req: Request, res: Response) => {
  const { token, channelId, uId } = req.body;
  save();
  res.json(channelAddOwnerV1(token, channelId, uId));
});

app.post('/channel/removeowner/v1', (req: Request, res: Response) => {
  const { token, channelId, uId } = req.body;
  save();
  res.json(channelRemoveOwnerV1(token, channelId, uId));
});

app.get('/channel/details/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const channelId = parseInt(req.query.channelId as string);
  save();
  res.json(channelDetailsV1(token, channelId));
});

app.get('/channel/messages/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const channelId = parseInt(req.query.channelId as string);
  const start = parseInt(req.query.start as string);
  save();
  res.json(channelMessagesV1(token, channelId, start));
});

// ========================================================================= 
// Message functions
app.post('/message/send/v1', (req: Request, res: Response) => {
  console.log('Message Sent');
  const { token, channelId, message } = req.body;
  save();
  res.json(messageSend(token, channelId, message));
});

app.get('/channel/messages/v2', (req: Request, res: Response) => {
  console.log('Channel Message History');
  const token = req.query.token as string;
  const channelId = parseInt(req.query.channelId as string);
  const start = parseInt(req.query.start as string);
  save();
  res.json(channelMessagesV1(token, channelId, start));
});

app.put('/message/edit/v1', (req: Request, res: Response) => {
  console.log('Message Edited');
  const { token, messageId, message } = req.body;
  save();
  res.json(messageEdit(token, messageId, message));
});

app.delete('/message/remove/v1', (req: Request, res: Response) => {
  console.log('Message Removed');
  const token = req.query.token as string; 
  const messageId = parseInt(req.query.messageId as string);
  save();
  res.json(messageRemove(token, messageId));
});

// ========================================================================= 
// Channels functions
app.post('/channels/create/v2', (req: Request, res: Response) => {
  console.log('Channel Created');
  const { token, name, isPublic } = req.body;
  save();
  res.json(channelsCreateV1(token, name, isPublic));
});

app.get('/channels/listAll/v2', (req: Request, res: Response) => {
  console.log('Channels List All');
  const token = req.query.token as string;
  save();
  res.json(channelsListAllV1(token));
});

// ========================================================================= 
// User/s functions
app.get('/user/profile/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const uId = parseInt(req.query.uId as string);
  save();
  res.json(userProfileV1(token, uId));
});

app.get('/users/all/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  save();
  res.json(usersAllV1(token));
});

app.put('/user/profile/setname/v1', (req: Request, res: Response) => {
  const { token, nameFirst, nameLast } = req.body;
  save();
  res.json(userSetNameV1(token, nameFirst, nameLast));
});

app.put('/user/profile/setemail/v1', (req: Request, res: Response) => {
  const { token, email } = req.body;
  save();
  res.json(userSetEmailV1(token, email));
});

app.put('/user/profile/sethandle/v1', (req: Request, res: Response) => {
  const { token, handleStr } = req.body;
  save();
  res.json(userSetHandleV1(token, handleStr));
});

// Dm functions
app.post('/dm/create/v1', (req: Request, res: Response) => {
  console.log('Dm created');
  const { token, uIds } = req.body;
  save();
  res.json(dmCreateV1(token, uIds));
});

app.get('/dm/messages/v1', (req: Request, res: Response) => {
  console.log('Dm Message History');
  const token = req.query.token as string;
  const dmId = parseInt(req.query.dmId as string);
  const start = parseInt(req.query.start as string);
  save();
  res.json(dmMessagesV1(token, dmId, start));
});

app.post('/message/senddm/v1', (req: Request, res: Response) => {
  console.log('Message Sent');
  const { token, dmId, message } = req.body;
  save();
  res.json(messageSendDmV1(token, dmId, message));
});
// ========================================================================= //