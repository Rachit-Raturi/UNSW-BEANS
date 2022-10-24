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

function requestchannelsCreate (token: string, channelId: number) {
  return requestHelper('GET', '/channel/details/v2', { token, channelId });
}

function requestchannelsList(token: string, channelId: number) {
  return requestHelper('POST', '/channel/join/v2', { token, channelId });
}

function requestChannelsListAll(token: string, channelId: number, uId: number) {
  return requestHelper('POST', '/channel/invite/v2', { token, channelId, uId });
}

function requestClear() {
  return requestHelper('DELETE', '/clear', {});
}

// ========================================================================= //


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

describe('Tests for channelsCreateV1', () => {
  test('Test 1: Invalid authUserId', () => {
    let invalidUserId = 1;
    if (user.authUserId === 1 || user1.authUserId === 1) {
      invalidUserId = 2;
    }
    expect(channelsCreateV1(invalidUserId, 'channel1', true))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 2: Name is greater then 20 characters', () => {
    expect(channelsCreateV1(user.authUserId, 'GreaterThentwentyCharacters', false))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 3: Name is less then 1', () => {
    expect(channelsCreateV1(user.authUserId, '', false))
      .toStrictEqual({ error: expect.any(String) });
  });
});

describe('Invalid channelsListV1 tests', () => {
  test('Test 1: Invalid authUserId - no users', () => {
    clearV1();
    expect(channelsListV1(1)).toStrictEqual({ error: expect.any(String) });
  });

  test('Test 2: Invalid authUserId - multiple users', () => {
    let invalidUserId = 1;

    if (user.authUserId === 1 || user1.authUserId === 1) {
      invalidUserId = 2;
    }

    if (user.authUserId === 2 || user1.authUserId === 2) {
      invalidUserId = 3;
    }

    expect(channelsListV1(invalidUserId)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Valid channelsListV1 tests', () => {
  test('Test 1: user in 1 course', () => {
    expect(channelsListV1(user.authUserId))
      .toStrictEqual({ channels: [{ channelId: channel1.channelId, name: 'My Channel1' }] });
  });

  test('Test 2: user in 0 courses', () => {
    expect(channelsListV1(user1.authUserId))
      .toStrictEqual({ channels: [] });
  });

  test('Test 3: user in 2 courses', () => {
    const channel2 = channelsCreateV1(user.authUserId, 'My Channel2', true);
    const outputArray = [];
    outputArray.push({ channelId: channel2.channelId, name: 'My Channel2' });
    outputArray.push({ channelId: channel1.channelId, name: 'My Channel1' });
    const expectedSet = new Set(outputArray);
    const receivedSet = new Set(channelsListV1(user.authUserId).channels);

    expect(receivedSet).toStrictEqual(expectedSet);
  });

  test('Test 4: user in multiple courses + test it ignores private channel', () => {
    const channel2 = channelsCreateV1(user.authUserId, 'My Channel2', true);
    expect(channelsCreateV1(user.authUserId, 'My Channel3', false))
      .toStrictEqual({ channelId: expect.any(Number) });

    const outputArray = [];
    outputArray.push({ channelId: channel1.channelId, name: 'My Channel1' });
    outputArray.push({ channelId: channel2.channelId, name: 'My Channel2' });
    const expectedSet = new Set(outputArray);
    const receivedSet = new Set(channelsListV1(user.authUserId).channels);

    expect(receivedSet).toStrictEqual(expectedSet);
  });
});

describe('Tests for channelsListAllV1 function', () => {
  test('Test 1: Invalid authUserId', () => {
    let invalidUserId = 1;
    if (user.authUserId === 1) {
      invalidUserId = 2;
    }
    if (user1.authUserId === invalidUserId) {
      invalidUserId = 3;
    }

    expect(channelsListAllV1(invalidUserId))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 2: user in 0 courses', () => {
    expect(channelsListAllV1(user1.authUserId))
      .toStrictEqual({ channels: [] });
  });

  test('Test 3: Valid Case - 1 channels', () => {
    expect(channelsListAllV1(user.authUserId))
      .toStrictEqual({ channels: [{ channelId: channel1.channelId, name: 'My Channel1' }] });
  });

  test('Test 4: Valid Case - 3 channels', () => {
    const channel2 = channelsCreateV1(user.authUserId, 'My Channel2', true);
    const channel3 = channelsCreateV1(user.authUserId, 'My Channel3', true);

    const outputArray = [];
    outputArray.push({ channelId: channel2.channelId, name: 'My Channel2' });
    outputArray.push({ channelId: channel3.channelId, name: 'My Channel3' });
    outputArray.push({ channelId: channel1.channelId, name: 'My Channel1' });

    const expectedSet = new Set(outputArray);
    const receivedSet = new Set(channelsListAllV1(user.authUserId).channels);

    expect(expectedSet).toStrictEqual(receivedSet);
  });

  test('Test 5: Valid Case - 6 channels', () => {
    const channel2 = channelsCreateV1(user.authUserId, 'My Channel2', true);
    const channel3 = channelsCreateV1(user.authUserId, 'My Channel3', true);
    const channel4 = channelsCreateV1(user.authUserId, 'My Channel4', true);
    const channel5 = channelsCreateV1(user.authUserId, 'My Channel5', true);
    const channel6 = channelsCreateV1(user.authUserId, 'My Channel6', true);
    const channel7 = channelsCreateV1(user.authUserId, 'My Channel7', true);

    const outputArray = [];
    outputArray.push({ channelId: channel3.channelId, name: 'My Channel3' });
    outputArray.push({ channelId: channel4.channelId, name: 'My Channel4' });
    outputArray.push({ channelId: channel1.channelId, name: 'My Channel1' });
    outputArray.push({ channelId: channel2.channelId, name: 'My Channel2' });
    outputArray.push({ channelId: channel5.channelId, name: 'My Channel5' });
    outputArray.push({ channelId: channel6.channelId, name: 'My Channel6' });
    outputArray.push({ channelId: channel7.channelId, name: 'My Channel7' });

    const expectedSet = new Set(outputArray);
    const receivedSet = new Set(channelsListAllV1(user.authUserId).channels);

    expect(expectedSet).toStrictEqual(receivedSet);
  });
});
