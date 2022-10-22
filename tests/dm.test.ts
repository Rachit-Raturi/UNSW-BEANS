import { authRegisterV1 } from '../src/auth';
import { channelsCreateV1 } from '../src/channels';
import { channelJoinV1 } from '../src/channel';

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

// ========================================================================= //

let user;
let user1;
let channel;
let start;

beforeEach(() => {
  requestClear();
  user = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
  user1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  channel = channelsCreateV1(user.token, 'test', true);
  start = 0;
});
