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

function requestDmCreate(token: string, uIds?: Array<number>) {
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

function requestDmSend(token: string, dmId: number, message: string) {
  return requestHelper('POST', '/message/senddm/v1', { token, dmId, message });
}

function requestClear() {
  return requestHelper('DELETE', '/clear', {});
}

// ========================================================================= //

let user;
let user1;
let invalidToken = 'invalid';
let invalidDm = -1;
let dm;
let start;

beforeEach(() => {
  requestClear();
  user = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
  user1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  start = 0;
});
 


describe('dm/create/v1', () => {
  test('any uId that does not refer to valid user', () => {
    expect(requestDmCreate(user.token, user1.uId + 1)).toStrictEqual(ERROR);
  });

  test('duplicate uIds', () => {
    expect(requestDmCreate(user.token, user.uId)).toStrictEqual(ERROR);
  });

  test('invalid token', () => {
    expect(requestDmCreate(invalidToken, user1.uId)).toStrictEqual(ERROR);
  });

  test('Successful dm', () => {
    expect(requestDmCreate(user.token, user.uId)).toStrictEqual(ERROR);
  });
});



beforeEach(() => {
  requestClear();
  user = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
  user1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  dm = requestDmCreate(user.token, user1.uId);
  start = 0;
});



describe('/dm/list/v1', () => {
  test('Test 1: Invalid token - extra characters', () => {
    expect(requestDmList(user.token + 'AA')).toStrictEqual(ERROR);
  });

  test('Test 2: Invalid token - missing characters', () => {
    expect(requestDmList(user.token.slice(0, -2))).toStrictEqual(ERROR);
  });

  test('Test 3: Valid case', () => {
    expect(requestDmList(user.token)).toStrictEqual({ 
      dms: [
        {
          dmId: dm,
          // name: 
        }
      ]
     })
  });

});



// describe('/dm/remove/v1', () => {
//   test('Test 1: Invalid token - extra characters', () => {
//     expect(requestDmRemove(user.token + 'AA',)).toStrictEqual(ERROR);
//   });

//   test('Test 2: Invalid token - missing characters', () => {
//     expect(requestDmRemove(user.token.slice(0, -2))).toStrictEqual(ERROR);
//   });

//   test('Test 3: Valid case', () => {
//     expect(requestDmRemove(user.token)).toStrictEqual({})
//   });

// });



describe('dm/messages/v1', () => {
  test('invalid dmId', () => {
    expect(requestDmMessages(user.token, invalidDm, start)).toStrictEqual(ERROR);
  });

  test('invalid token', () => {
    expect(requestDmMessages(invalidToken, dm.dmId, start)).toStrictEqual(ERROR);
  });

  test('start is greater than num of messages', () => {
    start = 1;
    expect(requestDmMessages(user.token, dm.dmId, start)).toStrictEqual(ERROR);
  });

  test('user is not in dm', () => {
    expect(requestDmMessages(user1.token, dm.dmId, start)).toStrictEqual(ERROR);
  });
});



describe('message/senddm/v1', () => {
  let message: string = "Hello World";
  test('invalid dmId', () => {
    expect(requestDmSend(user.token, invalidDm, message)).toStrictEqual(ERROR);
  });

  test('message is less than 1 character', () => {
    let emptyString: string;
    expect(requestDmSend(user.token, dm.dmId, emptyString)).toStrictEqual(ERROR);
  })

  test('message is more than 1000 characters', () => {
    let longString: string;
    for (let i = 0; i <= 1000; i++) {
      longString += 'a';
    }
    expect(requestDmSend(user.token, dm.dmId, longString)).toStrictEqual(ERROR);
  });

  test('user is not in dm', () => {
    expect(requestDmSend(user1.token, dm.dmId, message)).toStrictEqual(ERROR);
  });

  test('invalid token', () => {
    expect(requestDmSend(invalidToken, dm.dmId, message)).toStrictEqual(ERROR);
  });
});
