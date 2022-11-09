import request, { HttpVerb } from 'sync-request';

import { port, url } from '../src/config.json';

const SERVER_URL = `${url}:${port}`;

function requestHelper(method: HttpVerb, path: string, payload: object, token?: object) {
  let qs = {};
  let json = {};
  let headers = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }

  if (token !== undefined) {
    headers = token;
  }
  const res = request(method, SERVER_URL + path, { qs, json, headers });

  if (res.statusCode !== 200) {
    // Return error code number instead of object in case of error.
    // (just for convenience)
    return res.statusCode;
  }

  return JSON.parse(res.getBody('utf-8'));
}

// Wrapper functions
export function requestClear() {
  return requestHelper('DELETE', '/clear/v1', {});
}

// =========================================================================
// Auth functions
export function requestAuthLogin(email: string, password: string) {
  return requestHelper('POST', '/auth/login/v2', { email, password });
}

export function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  return requestHelper('POST', '/auth/register/v2', { email, password, nameFirst, nameLast });
}

export function requestAuthLogout(token: string) {
  return requestHelper('POST', '/auth/logout/v1', {}, { token: token });
}

// =========================================================================
// Channels functions
export function requestChannelsCreate(token: string, name: string, isPublic: boolean) {
  return requestHelper('POST', '/channels/create/v2', { name, isPublic }, { token: token });
}

export function requestChannelsList(token: string) {
  return requestHelper('GET', '/channels/list/v2', {}, { token: token });
}

export function requestChannelsListAll(token: string) {
  return requestHelper('GET', '/channels/listAll/v2', {}, { token: token });
}

// =========================================================================
// Channel functions
export function requestChannelDetails(token: string, channelId: number) {
  return requestHelper('GET', '/channel/details/v2', { channelId }, { token: token });
}

export function requestChannelJoin(token: string, channelId: number) {
  return requestHelper('POST', '/channel/join/v2', { channelId }, { token: token });
}

export function requestChannelInvite(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/invite/v2', { channelId, uId }, { token: token });
}

export function requestChannelMessages(token: string, channelId: number, start: number) {
  return requestHelper('GET', '/channel/messages/v2', { channelId, start }, { token: token });
}

export function requestChannelLeave(token: string, channelId: number) {
  return requestHelper('POST', '/channel/leave/v1', { channelId }, { token: token });
}

export function requestChannelAddOwner(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/addowner/v1', { channelId, uId }, { token: token });
}

export function requestChannelRemoveOwner(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/removeowner/v1', { channelId, uId }, { token: token });
}

// =========================================================================
// DM functions
export function requestDmCreate(token: string, uIds?: Array<number>) {
  return requestHelper('POST', '/dm/create/v1', { uIds }, { token: token });
}

export function requestDmList(token: string) {
  return requestHelper('GET', '/dm/list/v1', {}, { token: token });
}

export function requestDmRemove(token: string, dmId: number) {
  return requestHelper('DELETE', '/dm/remove/v1', { dmId }, { token: token });
}

export function requestDmDetails(token: string, dmId: number) {
  return requestHelper('GET', '/dm/details/v1', { dmId }, { token: token });
}

export function requestDmLeave(token: string, dmId: number) {
  return requestHelper('POST', '/dm/leave/v1', { dmId }, { token: token });
}

export function requestDmMessages(token: string, dmId: number, start: number) {
  return requestHelper('GET', '/dm/messages/v1', { dmId, start }, { token: token });
}

// =========================================================================
// Message Function
export function requestMessageSend(token: string, channelId: number, message: string) {
  return requestHelper('POST', '/message/send/v1', { channelId, message }, { token: token });
}

export function requestMessageEdit(token: string, messageId: number, message: string) {
  return requestHelper('PUT', '/message/edit/v1', { messageId, message }, { token: token });
}

export function requestMessageRemove(token: string, messageId: number) {
  return requestHelper('DELETE', '/message/remove/v1', { messageId }, { token: token });
}

export function requestMessageSendDm(token: string, dmId: number, message: string) {
  return requestHelper('POST', '/message/senddm/v1', { dmId, message }, { token: token });
}

// =========================================================================
// User/s Function
export function requestUserProfile(token: string, uId: number) {
  return requestHelper('GET', '/user/profile/v3', { uId }, { token: token });
}

export function requestUsersAll(token: string) {
  return requestHelper('GET', '/users/all/v2', {}, { token: token });
}

export function requestUserSetName(token: string, nameFirst: string, nameLast: string) {
  return requestHelper('PUT', '/user/profile/setname/v2', { nameFirst, nameLast }, { token: token });
}

export function requestUserSetEmail(token: string, email: string) {
  return requestHelper('PUT', '/user/profile/setemail/v2', { email }, { token: token });
}

export function requestUserSetHandle(token: string, handleStr: string) {
  return requestHelper('PUT', '/user/profile/sethandle/v2', { handleStr }, { token: token });
}
