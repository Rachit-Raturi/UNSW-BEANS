import request from 'sync-request';

import { port, url } from '../src/config.json';
import { clearV1 } from '../src/other';
import { channelsCreateV1 } from '../src/channels';
import { authRegisterV1 } from '../src/auth';

const SERVER_URL = `${url}:${port}`;

let user;
let user1;
let channel1;

beforeEach(() => {
  clearV1();
  user = authRegisterV1('test@gmail.com', 'password',
    'firstname', 'lastname');
  user1 = authRegisterV1('test1@gmail.com', 'password1',
    'firstname1', 'lastname1');
  channel1 = channelsCreateV1(user.authUserId, 'My Channel1', true);
});

function requestMessageSendV1(token: string, channelId: number, message: string) {
  const res = request(
    'POST',
    SERVER_URL + '/message/send/v1',
    {
      json: {
        token,
        channelId,
        message,
      }
    }
  );
  return JSON.parse(res.getBody() as string);
}

// test('Successful case', () => {
//   expect(requestMessageSendV1(user.token, channel1.channelId, "Message")).toStrictEqual({messageId: expect.any(Number)});
// });

test('Successful case - Ids are unique', () => {
  let arr: number[];
  arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push(requestMessageSendV1(user.token, channel1.channelId, 'Message'));
  }

  const unique = Array.from(new Set(arr));
  expect(unique.length).toStrictEqual(10);
});

test('Invalid ChannelId', () => {
  const invalidChannelId = channel1.channelId + 1;
  expect(requestMessageSendV1(user.token, invalidChannelId, 'Message')).toStrictEqual({ error: expect.any(String) });
});

// test('Invalid Token', () => {
//   let invalidToken = user.token.splice(0, -1);
//   expect(requestMessageSendV1(invalidToken, channel1.channelId, "Message")).toStrictEqual({error: expect.any(String)});
// });

test('User is not a Member', () => {
  expect(requestMessageSendV1(user1.token, channel1.channelId, 'Message')).toStrictEqual({ error: expect.any(String) });
});

test('Invalid message lengths', () => {
  let longString: string;
  for (let i = 0; i <= 1000; i++) {
    longString += 'a';
  }

  const emptyString = ' ';
  expect(requestMessageSendV1(user.token, channel1.channelId, longString)).toStrictEqual({ error: expect.any(String) });
  expect(requestMessageSendV1(user.token, channel1.channelId, emptyString)).toStrictEqual({ error: expect.any(String) });
});
