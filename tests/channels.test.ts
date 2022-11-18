import {
  requestClear,
  requestAuthRegister,
  requestChannelsCreate,
  requestChannelsList,
  requestChannelsListAll
} from './helper';

interface userType {
  token: string,
  authUserId: number
}

interface channelType {
  channelId: number
}

let user: userType;
let user1: userType;
let channel1: channelType;
let invalidtoken = 'invalid';

beforeEach(() => {
  requestClear();
  user = requestAuthRegister('test@gmail.com', 'password', 'firstname', 'lastname');
  user1 = requestAuthRegister('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  channel1 = requestChannelsCreate(user.token, 'My Channel1', true);

  if (user.token === invalidtoken || user1.token === invalidtoken) {
    invalidtoken = 'invalid1';
  }
  if (user.token === invalidtoken || user1.token === invalidtoken) {
    invalidtoken = 'invalid2';
  }
});

// =========================================================================
// Channels Create Tests
describe('/channels/create/v2', () => {
  describe('Error', () => {
    test('Test 1: Invalid token', () => {
      const invalidToken = '0';
      expect(requestChannelsCreate(invalidToken, 'channel1', true)).toStrictEqual(403);
    });

    test('Test 2: Name is greater then 20 characters', () => {
      expect(requestChannelsCreate(user.token, 'GreaterThentwentyCharacters', false)).toStrictEqual(400);
    });

    test('Test 3: Name is less then 1', () => {
      expect(requestChannelsCreate(user.token, '', false)).toStrictEqual(400);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestChannelsCreate(user.token, 'channel1', true)).toStrictEqual({ channelId: expect.any(Number) });
  });
});

// =========================================================================
// Channels List Tests
describe('/channels/list/v2', () => {
  test('Error Test 1: No user', () => {
    expect(requestChannelsList(invalidtoken)).toStrictEqual(403);
  });

  test('Test 1: User in 1 channel', () => {
    expect(requestChannelsList(user.token)).toStrictEqual(
      {
        channels:
        [
          {
            channelId: channel1.channelId,
            name: 'My Channel1'
          }
        ]
      }
    );
  });

  test('Test 2: User in 0 channels', () => {
    expect(requestChannelsList(user1.token)).toStrictEqual({ channels: [] });
  });

  test('Test 3: User in 2 channels', () => {
    const channel2 = requestChannelsCreate(user.token, 'My Channel2', true);
    const outputArray = [];
    outputArray.push({ channelId: channel2.channelId, name: 'My Channel2' });
    outputArray.push({ channelId: channel1.channelId, name: 'My Channel1' });
    const expectedSet = new Set(outputArray);
    const receivedSet = new Set(requestChannelsList(user.token).channels);
    expect(receivedSet).toStrictEqual(expectedSet);
  });

  test('Test 4: User in multiple courses', () => {
    const channel2 = requestChannelsCreate(user.token, 'My Channel2', false);
    const outputArray = [];
    outputArray.push({ channelId: channel1.channelId, name: 'My Channel1' });
    outputArray.push({ channelId: channel2.channelId, name: 'My Channel2' });
    const expectedSet = new Set(outputArray);
    const receivedSet = new Set(requestChannelsList(user.token).channels);
    expect(receivedSet).toStrictEqual(expectedSet);
  });
});

// =========================================================================
// Channels List All Tests
describe('/channels/listAll/v2', () => {
  test('Test 1: Invalid authUserId', () => {
    expect(requestChannelsListAll('invalidUserId'))
      .toStrictEqual(403);
  });

  test('Test 2: Valid Case - 1 channels', () => {
    expect(requestChannelsListAll(user.token))
      .toStrictEqual({ channels: [{ channelId: channel1.channelId, name: 'My Channel1' }] });
  });

  test('Test 3: Valid Case - 3 channels', () => {
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
});
