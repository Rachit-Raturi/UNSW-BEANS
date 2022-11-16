import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import fs from 'fs';
import { getData, setData } from './dataStore';

import { authLoginV1, authRegisterV1, authLogoutV1 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1, channelLeaveV1, channelAddOwnerV1, channelRemoveOwnerV1 } from './channel';
import { dmCreateV1, dmDetailsV1, dmListV1, dmRemoveV1, dmLeaveV1, dmMessagesV1, messageSendDmV1 } from './dm';
import { messageUnReact, messageSendV1, messageEditV1, messageRemoveV1, messageReact } from './message';
import { userProfileV1, usersAllV1, userSetNameV1, userSetHandleV1, userSetEmailV1, userStats, usersStats, userPhoto } from './users';
import { search } from './search';
import { clearV1 } from './other';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

if (fs.existsSync('./src/database.json')) {
  const dbstr = fs.readFileSync('./src/database.json');
  setData(JSON.parse(String(dbstr)));
}

const data = getData();
const save = () => {
  const jsonstr = JSON.stringify(data);
  fs.writeFileSync('./src/database.json', jsonstr);
};
// Example get request
app.get('/echo', (req: Request, res: Response, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

// handles errors nicely
app.use(errorHandler());

// for logging errors (print to terminal)
app.use(morgan('dev'));

// start server
const server = app.listen(parseInt(process.env.PORT || config.port), process.env.IP, () => {
  console.log(`⚡️ Server listening on port ${process.env.PORT || config.port}`);
});

app.use('/imgurl', express.static('imgurl'));

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});

app.delete('/clear/v1', (req: Request, res: Response) => {
  save();
  res.json(clearV1());
});

// =========================================================================
// Auth functions
app.post('/auth/login/v3', (req: Request, res: Response) => {
  const { email, password } = req.body;
  save();
  res.json(authLoginV1(email, password));
});

app.post('/auth/register/v3', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  save();
  res.json(authRegisterV1(email, password, nameFirst, nameLast));
});

app.post('/auth/logout/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  save();
  res.json(authLogoutV1(token));
});

// =========================================================================
// Channels functions
app.post('/channels/create/v3', (req: Request, res: Response) => {
  console.log('Channel Created');
  const token = req.header('token');
  const { name, isPublic } = req.body;
  save();
  res.json(channelsCreateV1(token, name, isPublic));
});

app.get('/channels/list/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  save();
  res.json(channelsListV1(token));
});

app.get('/channels/listAll/v3', (req: Request, res: Response) => {
  console.log('Channels List All');
  const token = req.header('token');
  save();
  res.json(channelsListAllV1(token));
});

// =========================================================================
// Channel functions
app.get('/channel/details/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const channelId = parseInt(req.query.channelId as string);
  save();
  res.json(channelDetailsV1(token, channelId));
});

app.post('/channel/join/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId } = req.body;
  save();
  res.json(channelJoinV1(token, channelId));
});

app.post('/channel/invite/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, uId } = req.body;
  save();
  res.json(channelInviteV1(token, channelId, uId));
});

app.get('/channel/messages/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const channelId = parseInt(req.query.channelId as string);
  const start = parseInt(req.query.start as string);
  save();
  res.json(channelMessagesV1(token, channelId, start));
});

app.post('/channel/leave/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId } = req.body;
  save();
  res.json(channelLeaveV1(token, channelId));
});

app.post('/channel/addowner/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, uId } = req.body;
  save();
  res.json(channelAddOwnerV1(token, channelId, uId));
});

app.post('/channel/removeowner/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, uId } = req.body;
  save();
  res.json(channelRemoveOwnerV1(token, channelId, uId));
});

// =========================================================================
// DM functions
app.post('/dm/create/v2', (req: Request, res: Response) => {
  console.log('DM created');
  const token = req.header('token');
  const { uIds } = req.body;
  save();
  res.json(dmCreateV1(token, uIds));
});

app.get('/dm/messages/v2', (req: Request, res: Response) => {
  console.log('DM Message History');
  const token = req.header('token');
  const dmId = parseInt(req.query.dmId as string);
  const start = parseInt(req.query.start as string);
  save();
  res.json(dmMessagesV1(token, dmId, start));
});

app.get('/dm/list/v2', (req: Request, res: Response) => {
  console.log('DM List');
  const token = req.header('token');
  save();
  res.json(dmListV1(token));
});

app.delete('/dm/remove/v2', (req: Request, res: Response) => {
  console.log('DM Removed');
  const token = req.header('token');
  const dmId = parseInt(req.query.dmId as string);
  save();
  res.json(dmRemoveV1(token, dmId));
});

app.get('/dm/details/v2', (req: Request, res: Response) => {
  console.log('DM details');
  const token = req.header('token');
  const dmId = parseInt(req.query.dmId as string);
  save();
  res.json(dmDetailsV1(token, dmId));
});

app.post('/dm/leave/v2', (req: Request, res: Response) => {
  console.log('DM leave');
  const token = req.header('token');
  const { dmId } = req.body;
  save();
  res.json(dmLeaveV1(token, dmId));
});

app.post('/message/senddm/v2', (req: Request, res: Response) => {
  console.log('Message Sent');
  const token = req.header('token');
  const { dmId, message } = req.body;
  save();
  res.json(messageSendDmV1(token, dmId, message));
});

// =========================================================================
// Message functions
app.post('/message/send/v2', (req: Request, res: Response) => {
  console.log('Message Sent');
  const token = req.header('token');
  const { channelId, message } = req.body;
  save();
  res.json(messageSendV1(token, channelId, message));
});

app.put('/message/edit/v2', (req: Request, res: Response) => {
  console.log('Message Edited');
  const token = req.header('token');
  const { messageId, message } = req.body;
  save();
  res.json(messageEditV1(token, messageId, message));
});

app.delete('/message/remove/v2', (req: Request, res: Response) => {
  console.log('Message Removed');
  const token = req.header('token');
  const messageId = parseInt(req.query.messageId as string);
  save();
  res.json(messageRemoveV1(token, messageId));
});

app.post('/message/react/v1', (req: Request, res: Response) => {
  console.log('Message Reacted');
  const token = req.header('token');
  const { reactId, messageId } = req.body;
  save();
  res.json(messageReact(token, messageId, reactId));
});
app.post('/message/unreact/v1', (req: Request, res: Response) => {
  console.log('Message Reacted');
  const token = req.header('token');
  const { reactId, messageId } = req.body;
  save();
  res.json(messageUnReact(token, messageId, reactId));
});

// =========================================================================
// User/s functions
app.get('/user/profile/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const uId = parseInt(req.query.uId as string);
  save();
  res.json(userProfileV1(token, uId));
});

app.get('/users/all/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  save();
  res.json(usersAllV1(token));
});

app.put('/user/profile/setname/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { nameFirst, nameLast } = req.body;
  save();
  res.json(userSetNameV1(token, nameFirst, nameLast));
});

app.put('/user/profile/setemail/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { email } = req.body;
  save();
  res.json(userSetEmailV1(token, email));
});

app.put('/user/profile/sethandle/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { handleStr } = req.body;
  save();
  res.json(userSetHandleV1(token, handleStr));
});

app.get('/user/stats/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  save();
  res.json(userStats(token));
});

app.get('/users/stats/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  save();
  res.json(usersStats(token));
});

app.get('/search/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const queryStr = req.query.queryStr as string;
  save();
  res.json(search(token, queryStr));
});

app.post('/user/profile/uploadphoto/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const { imgUrl, xStart, yStart, xEnd, yEnd } = req.body;
  save();
  res.json(userPhoto(token, imgUrl, xStart, yStart, xEnd, yEnd));
});
