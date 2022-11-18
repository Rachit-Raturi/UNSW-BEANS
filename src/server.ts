import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import fs from 'fs';
import { getData, setData } from './dataStore';

import { authLoginV1, authRegisterV1, authLogoutV1, authPasswordResetRequestV1, authPasswordResetV1 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1, channelLeaveV1, channelAddOwnerV1, channelRemoveOwnerV1 } from './channel';
import { dmCreateV1, dmDetailsV1, dmListV1, dmRemoveV1, dmLeaveV1, dmMessagesV1, messageSendDmV1 } from './dm';
import { messageUnReact, messageSendV1, messageEditV1, messageRemoveV1, messageReact, messagePin, messageUnpin, messageSendLater } from './message';
import { userProfileV1, usersAllV1, userSetNameV1, userSetHandleV1, userSetEmailV1, userStats, usersStats, userPhoto } from './users';
import { search } from './search';
import { adminUserPermissionChangeV1, adminUserRemoveV1 } from './admin';
import { clearV1 } from './other';
import { standupActiveV1, standupSendV1, standupStartV1 } from './standup';

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
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

app.use('/imgurl', express.static('imgurl'));

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});

app.delete('/clear/v1', (req: Request, res: Response) => {
  res.json(clearV1());
  save();
});

// =========================================================================
// Auth functions
app.post('/auth/login/v3', (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json(authLoginV1(email, password));
  save();
});

app.post('/auth/register/v3', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(authRegisterV1(email, password, nameFirst, nameLast));
  save();
});

app.post('/auth/logout/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(authLogoutV1(token));
  save();
});

app.post('/auth/passwordreset/request/v1', (req: Request, res: Response) => {
  const { email } = req.body;
  res.json(authPasswordResetRequestV1(email));
  save();
});

app.post('/auth/passwordreset/reset/v1', (req: Request, res: Response) => {
  const { resetCode, newPassword } = req.body;
  res.json(authPasswordResetV1(resetCode, newPassword));
  save();
});

// =========================================================================
// Channels functions
app.post('/channels/create/v3', (req: Request, res: Response) => {
  console.log('Channel Created');
  const token = req.header('token');
  const { name, isPublic } = req.body;
  res.json(channelsCreateV1(token, name, isPublic));
  save();
});

app.get('/channels/list/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(channelsListV1(token));
  save();
});

app.get('/channels/listAll/v3', (req: Request, res: Response) => {
  console.log('Channels List All');
  const token = req.header('token');
  res.json(channelsListAllV1(token));
  save();
});

// =========================================================================
// Channel functions
app.get('/channel/details/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const channelId = parseInt(req.query.channelId as string);
  res.json(channelDetailsV1(token, channelId));
  save();
});

app.post('/channel/join/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId } = req.body;
  res.json(channelJoinV1(token, channelId));
  save();
});

app.post('/channel/invite/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, uId } = req.body;
  res.json(channelInviteV1(token, channelId, uId));
  save();
});

app.get('/channel/messages/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const channelId = parseInt(req.query.channelId as string);
  const start = parseInt(req.query.start as string);
  res.json(channelMessagesV1(token, channelId, start));
  save();
});

app.post('/channel/leave/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId } = req.body;
  res.json(channelLeaveV1(token, channelId));
  save();
});

app.post('/channel/addowner/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, uId } = req.body;
  res.json(channelAddOwnerV1(token, channelId, uId));
  save();
});

app.post('/channel/removeowner/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, uId } = req.body;
  res.json(channelRemoveOwnerV1(token, channelId, uId));
  save();
});

// =========================================================================
// DM functions
app.post('/dm/create/v2', (req: Request, res: Response) => {
  console.log('DM created');
  const token = req.header('token');
  const { uIds } = req.body;
  res.json(dmCreateV1(token, uIds));
  save();
});

app.get('/dm/messages/v2', (req: Request, res: Response) => {
  console.log('DM Message History');
  const token = req.header('token');
  const dmId = parseInt(req.query.dmId as string);
  const start = parseInt(req.query.start as string);
  res.json(dmMessagesV1(token, dmId, start));
  save();
});

app.get('/dm/list/v2', (req: Request, res: Response) => {
  console.log('DM List');
  const token = req.header('token');
  res.json(dmListV1(token));
  save();
});

app.delete('/dm/remove/v2', (req: Request, res: Response) => {
  console.log('DM Removed');
  const token = req.header('token');
  const dmId = parseInt(req.query.dmId as string);
  res.json(dmRemoveV1(token, dmId));
  save();
});

app.get('/dm/details/v2', (req: Request, res: Response) => {
  console.log('DM details');
  const token = req.header('token');
  const dmId = parseInt(req.query.dmId as string);
  res.json(dmDetailsV1(token, dmId));
  save();
});

app.post('/dm/leave/v2', (req: Request, res: Response) => {
  console.log('DM leave');
  const token = req.header('token');
  const { dmId } = req.body;
  res.json(dmLeaveV1(token, dmId));
  save();
});

app.post('/message/senddm/v2', (req: Request, res: Response) => {
  console.log('Message Sent');
  const token = req.header('token');
  const { dmId, message } = req.body;
  res.json(messageSendDmV1(token, dmId, message));
  save();
});

// =========================================================================
// Message functions
app.post('/message/send/v2', (req: Request, res: Response) => {
  console.log('Message Sent');
  const token = req.header('token');
  const { channelId, message } = req.body;
  res.json(messageSendV1(token, channelId, message));
  save();
});

app.put('/message/edit/v2', (req: Request, res: Response) => {
  console.log('Message Edited');
  const token = req.header('token');
  const { messageId, message } = req.body;
  res.json(messageEditV1(token, messageId, message));
  save();
});

app.delete('/message/remove/v2', (req: Request, res: Response) => {
  console.log('Message Removed');
  const token = req.header('token');
  const messageId = parseInt(req.query.messageId as string);
  res.json(messageRemoveV1(token, messageId));
  save();
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

app.post('/message/pin/v1', (req: Request, res: Response) => {
  console.log('Message Pinned');
  const token = req.header('token');
  const { messageId } = req.body;
  save();
  res.json(messagePin(token, messageId));
});

app.post('/message/unpin/v1', (req: Request, res: Response) => {
  console.log('Message Unpinned');
  const token = req.header('token');
  const { messageId } = req.body;
  save();
  res.json(messageUnpin(token, messageId));
});

app.post('/message/sendlater/v1', (req: Request, res: Response) => {
  console.log('Message sent later');
  const token = req.header('token');
  const { channelId, message, timeSent } = req.body;
  save();
  res.json(messageSendLater(token, channelId, message, timeSent));
});

// =========================================================================
// User/s functions
app.get('/user/profile/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const uId = parseInt(req.query.uId as string);
  res.json(userProfileV1(token, uId));
  save();
});

app.get('/users/all/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(usersAllV1(token));
  save();
});

app.put('/user/profile/setname/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { nameFirst, nameLast } = req.body;
  res.json(userSetNameV1(token, nameFirst, nameLast));
  save();
});

app.put('/user/profile/setemail/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { email } = req.body;
  res.json(userSetEmailV1(token, email));
  save();
});

app.put('/user/profile/sethandle/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { handleStr } = req.body;
  res.json(userSetHandleV1(token, handleStr));
  save();
});

app.get('/user/stats/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(userStats(token));
  save();
});

app.get('/users/stats/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(usersStats(token));
  save();
});

// =========================================================================
// admin functions

app.delete('/admin/user/remove/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const uId = parseInt(req.query.uId as string);
  res.json(adminUserRemoveV1(uId, token));
  save();
});

app.post('/admin/userpermission/change/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const { uId, permissionId } = req.body;
  res.json(adminUserPermissionChangeV1(uId, permissionId, token));
  save();
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

// =========================================================================
// Standup functions
app.post('/standup/start/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, length } = req.body;
  save();
  res.json(standupStartV1(token, channelId, length));
});

app.get('/standup/active/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const channelId = parseInt(req.query.channelId as string);
  save();
  res.json(standupActiveV1(token, channelId));
});

app.post('/standup/send/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, message } = req.body;
  save();
  res.json(standupSendV1(token, channelId, message));
});
