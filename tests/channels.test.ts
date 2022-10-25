import request, { HttpVerb } from 'sync-request';
import { 
  requestChannelsCreate,
  requestChannelsListAll,
  requestauthRegister, 
  requestChannelsList, 
  requestClear
} from './helper'
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

// ========================================================================= //


let user;
let user1;
let channel1;

beforeEach(() => {
  requestClear();
  user = requestauthRegister('test@gmail.com', 'password',
    'firstname', 'lastname');

  
  user1 = requestauthRegister('test1@gmail.com', 'password1',
    'firstname1', 'lastname1');
  channel1 = requestChannelsCreate(user.token, 'My Channel1', true);
});

describe('Tests for requestChannelsCreate', () => {
  test('Valid Case ', () => {
  
    expect(requestChannelsCreate(user.token, 'channel1', true))
      .toStrictEqual({ channelId: expect.any(Number) });
  });


  test('Invalid case - Invalid token', () => {
    let invalidToken = "0"
    expect(requestChannelsCreate(invalidToken, 'channel1', true))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid case - Name is greater then 20 characters', () => {
    expect(requestChannelsCreate(user.uId, 'GreaterThentwentyCharacters', false))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid case - Name is less then 1', () => {
    expect(requestChannelsCreate(user.uId, '', false))
      .toStrictEqual({ error: expect.any(String) });
  });
});

describe('channelsListV1 tests', () => {
  test('Invalid Test 1: no user', () => {
    requestClear();
   expect(requestChannelsList('invalid')).toStrictEqual(ERROR);
  });
  test('Test 1: user in 1 channel', () => {
    expect(requestChannelsList(user.token))
      .toStrictEqual({ channels: [{ channelId: channel1.channelId, name: 'My Channel1' }] });
  });

  test('Test 2: user in 0 channels', () => {
    expect(requestChannelsList(user1.token))
      .toStrictEqual({ channels: [] });
  });

  test('Test 3: user in 2 channels', () => {
    const channel2 = requestChannelsCreate(user.token, 'My Channel2', true);
    const outputArray = [];
    outputArray.push({ channelId: channel2.channelId, name: 'My Channel2' });
    outputArray.push({ channelId: channel1.channelId, name: 'My Channel1' });
    const expectedSet = new Set(outputArray);
    const receivedSet = new Set(requestChannelsList(user.token).channels);
    expect(receivedSet).toStrictEqual(expectedSet);
  });

  test('Test 4: user in multiple courses + test it ignores private channel', () => {
    const channel2 = requestChannelsCreate(user.authUserId, 'My Channel2', true);
    expect(requestChannelsCreate(user.authUserId, 'My Channel3', false))
      .toStrictEqual({ channelId: expect.any(Number) });
    const outputArray = [];
    outputArray.push({ channelId: channel1.channelId, name: 'My Channel1' });
    outputArray.push({ channelId: channel2.channelId, name: 'My Channel2' });
    const expectedSet = new Set(outputArray);
    const receivedSet = new Set(requestChannelsList(user.token).channels);

    expect(receivedSet).toStrictEqual(expectedSet);
  });
});

describe('Tests for channelsList AllV1 function', () => {
  test('Test 1: Invalid authUserId', () => {
    let invalidUserId = 1;
    if (user.authUserId === 1) {
      invalidUserId = 2;
    }
    if (user1.authUserId === invalidUserId) {
      invalidUserId = 3;
    }

    expect(requestChannelsListAll("invalidUserId")) 
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 2: user in 0 courses', () => {
    let user3 = requestauthRegister('3test@gmail.com', '3password',
    '3firstname', '3lastname');
    expect(requestChannelsListAll(user3.token))
      .toStrictEqual({ channels: [] });
  });

  test('Test 3: Valid Case - 1 channels', () => {
    expect(requestChannelsListAll(user.token))
      .toStrictEqual({ channels: [{ channelId: channel1.channelId, name: 'My Channel1' }] });
  });

  test('Test 4: Valid Case - 3 channels', () => {
    const channel2 = requestChannelsCreate(user.token, 'My Channel2', true);
    const channel3 = requestChannelsCreate(user.token, 'My Channel3', true);

    const outputArray = [];
    outputArray.push({ channelId: channel2.channelId, name: 'My Channel2' });
    outputArray.push({ channelId: channel3.channelId, name: 'My Channel3' });
    outputArray.push({ channelId: channel1.channelId, name: 'My Channel1' });

    const expectedSet = new Set(outputArray);
    const receivedSet = new Set(requestChannelsListAll(user.token).channels);

    expect(expectedSet).toStrictEqual(receivedSet);
  });

  test('Test 5: Valid Case - 6 channels', () => {
    const channel2 = requestChannelsCreate(user.token, 'My Channel2', true);
    const channel3 = requestChannelsCreate(user.token, 'My Channel3', true);
    const channel4 = requestChannelsCreate(user.token, 'My Channel4', true);
    const channel5 = requestChannelsCreate(user.token, 'My Channel5', true);
    const channel6 = requestChannelsCreate(user.token, 'My Channel6', true);
    const channel7 = requestChannelsCreate(user.token, 'My Channel7', true);

    const outputArray = [];
    outputArray.push({ channelId: channel3.channelId, name: 'My Channel3' });
    outputArray.push({ channelId: channel4.channelId, name: 'My Channel4' });
    outputArray.push({ channelId: channel1.channelId, name: 'My Channel1' });
    outputArray.push({ channelId: channel2.channelId, name: 'My Channel2' });
    outputArray.push({ channelId: channel5.channelId, name: 'My Channel5' });
    outputArray.push({ channelId: channel6.channelId, name: 'My Channel6' });
    outputArray.push({ channelId: channel7.channelId, name: 'My Channel7' });

    const expectedSet = new Set(outputArray);
    const receivedSet = new Set(requestChannelsListAll(user.token).channels);

    expect(expectedSet).toStrictEqual(receivedSet);
  });
});
