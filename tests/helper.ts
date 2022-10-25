import request, { HttpVerb } from 'sync-request';

import { port, url } from '../src/config.json';

const SERVER_URL = `${url}:${port}`;
const ERROR = { error: expect.any(String) };

function requestHelper(method: HttpVerb, path: string, payload: object) {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  const res = request(method, SERVER_URL + path, { qs, json });
  return JSON.parse(res.getBody('utf-8'));
}

// ========================================================================= //

// Wrapper functions

// Auth functions
function requestauthLogin(email: string, password: string) {
    return requestHelper('POST', '/auth/login/v2', { email, password });
  }
  
function requestauthRegiser(email: string, password: string, nameFirst: string, nameLast: string) {
  return requestHelper('POST', '/auth/register/v2', { email, password, nameFirst, nameLast });
}

// Channels functions 
function requestChannelsCreate( authUserId: number, name: string, isPublic: boolean  ) {
  return requestHelper('POST', '/channels/create/v2', { authUserId, name, isPublic } );
}

function requestChannelsList( token: string ) {
  return requestHelper('GET', '/channels/list/v2', { token } );
}

function requestChannelsListAll( token: string  ) {
  return requestHelper('GET', '/channels/listAll/v2', { token} );
}

function requestChannelDetails( token: string, channelId: number, ){
  return requestHelper('GET', '/channel/details/v2', { token, channelId } );
}

// Channel functions
function requestChannelJoin( authUserId: number, name: string, isPublic: boolean  ) {
  return requestHelper('POST', '/channel/join/v2', { authUserId, name, isPublic } );
}

function requestChannelInvite( token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/invite/v2', { token, channelId, uId } );
}

function requestChannelMessages( token: string, channelId: number, start: number) {
  return requestHelper('GET', '/channel/messages/v2', { token, channelId, start } );
}

// DM functions
function requestDmCreate(token: string, uIds: Array<number>) {
  return requestHelper('POST', '/dm/create/v1', { token, uIds });
}

function requestDmList(token: string) {
  return requestHelper('GET', '/dm/list/v1', { token });
}

function requestDmRemove(token: string, dmId: number) {
  return requestHelper('DELETE', '/dm/remove/v1', { token, dmId });
}

function requestDmDetails(token: string, dmId: number) {
  return requestHelper('GET', '/dm/details/v1', { token, dmId });
}

function requestDmLeave(token: string, dmId: number) {
  return requestHelper('POST', '/dm/leave/v1', { token, dmId });
}

function requestDmMessages(token: string, dmId: number, start: number) {
  return requestHelper('GET', '/dm/messages/v1', { token, dmId, start });
}

function requestClear() {
  return requestHelper('DELETE', '/clear', {});
}

// Message Function 
function requestMessageSend( token: string, channelId: number, message: string ) {
  return requestHelper('POST', '/message/send/v1', { token, channelId, message} );
}

function requestMessageEdit( token: string, messageId: number, message: string ) {
  return requestHelper('PUT', '/message/edit/v12', {token, messageId, message} );
}

function requestMessageDelete( token: string, messageId: number) {
  return requestHelper('DELETE', '/message/delete/v1', { token, messageId });
}

// ========================================================================= //