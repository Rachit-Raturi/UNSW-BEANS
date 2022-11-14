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

const ERROR = { error: expect.any(String) };

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
      expect(requestChannelsCreate(invalidToken, 'channel1', true)).toStrictEqual(ERROR);
    });

    test('Test 2: Name is greater then 20 characters', () => {
      expect(requestChannelsCreate(user.token, 'GreaterThentwentyCharacters', false)).toStrictEqual(ERROR);
    });

    test('Test 3: Name is less then 1', () => {
      expect(requestChannelsCreate(user.token, '', false)).toStrictEqual(ERROR);
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
    let invalidUserId = 1;
    if (user.authUserId === 1) {
      invalidUserId = 2;
    }
    if (user1.authUserId === invalidUserId) {
      invalidUserId = 3;
    }

    expect(requestChannelsListAll('invalidUserId'))
      .toStrictEqual(ERROR);
  });

  test('Test 2: User in 0 courses', () => {
    const user3 = requestAuthRegister('3test@gmail.com', '3password',
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
