import {
  requestClear,
  requestAuthRegister,
  requestChannelsCreate,
  requestChannelJoin,
  requestStandupStart,
  requestStandupActive,
  requestStandupSend
} from './helper';

interface userType {
  token: string,
  authUserId: number
}

let user: userType;
let user1: userType;
let channel: number;
let invalidToken = 'invalid';
let length: number;
const expectedTimeFinish: number = Math.floor(Date.now() / 1000) + length + 2;

beforeEach(() => {
  requestClear();
  user = requestAuthRegister('test@gmail.com', 'password', 'firstname', 'lastname');
  user1 = requestAuthRegister('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  channel = requestChannelsCreate(user.token, 'test', true);
  length = 1000;

  if (user.token === invalidToken || user1.token === invalidToken) {
    invalidToken = 'invalid1';
  }
  if (user.token === invalidToken || user1.token === invalidToken) {
    invalidToken = 'invalid2';
  }
});

// =========================================================================
// Standup Start Tests
describe('/standup/start/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid channelId', () => {
      expect(requestStandupStart(user.token, channel + 1, length)).toStrictEqual(400);
    });

    test('Test 2: Invalid token', () => {
      expect(requestStandupStart(invalidToken, channel, length)).toStrictEqual(403);
    });

    test('Test 3: Invalid length', () => {
      expect(requestStandupStart(user.token, channel, -length)).toStrictEqual(400);
    });

    test('Test 4: An active standup is already running', () => {
      requestStandupStart(user.token, channel, length);
      expect(requestStandupStart(user.token, channel, length)).toStrictEqual(400);
    });

    test('Test 5: User is not a member of the channel', () => {
      expect(requestStandupStart(user1.token, channel, length)).toStrictEqual(403);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestStandupStart(user.token, channel, length)).toStrictEqual(Math.floor(Date.now() / 1000) + length + 2);
  });
});

// =========================================================================
// Standup Active Tests
describe('/standup/active/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid channelId', () => {
      expect(requestStandupActive(user.token, channel + 1)).toStrictEqual(400);
    });

    test('Test 2: Invalid token', () => {
      expect(requestStandupActive(invalidToken, channel)).toStrictEqual(403);
    });

    test('Test 3: User is not a member of the channel', () => {
      expect(requestStandupActive(user1.token, channel)).toStrictEqual(403);
    });
  });

  test('Test 1: Successful case - an active channel', () => {
    const timeFinish: number = requestStandupStart(user.token, channel, length);
    expect(requestStandupActive(user.token, channel)).toStrictEqual(
      {
        isActive: true,
        timeFinish: timeFinish
      }
    );
  });

  test('Test 2: Successful case - an inactive channel', () => {
    expect(requestStandupActive(user.token, channel)).toStrictEqual(
      {
        isActive: false,
        timeFinish: null
      }
    );
  });
});

// =========================================================================
// Standup Send Tests
describe('/standup/send/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid channelId', () => {
      expect(requestStandupSend(user.token, channel + 1, 'Sending a message')).toStrictEqual(400);
    });

    test('Test 2: Invalid token', () => {
      expect(requestStandupSend(invalidToken, channel, 'Sending a message')).toStrictEqual(403);
    });

    test('Test 3: No active standup is running', () => {
      expect(requestStandupStart(user.token, channel, length)).toStrictEqual(expectedTimeFinish);
      expect(requestStandupSend(user.token, channel, 'Sending a message')).toStrictEqual(400);
    });

    test('Test 4: Invalid message lengths', () => {
      let longString: string;
      for (let i = 0; i <= 1000; i++) {
        longString += 'a';
      }
      expect(requestStandupSend(user.token, channel, longString)).toStrictEqual(400);
      expect(requestStandupSend(user.token, channel, '')).toStrictEqual(400);
    });
  });

  test('Test 1: Successful case - 1 user sends multiple messages', () => {
    expect(requestStandupSend(user.token, channel, 'Sending a message')).toStrictEqual({});
    expect(requestStandupSend(user.token, channel, 'Sending a 2nd message')).toStrictEqual({});
  });

  test('Test 2: Successful case - 2 users send messages', () => {
    expect(requestChannelJoin(user1.token, channel)).toStrictEqual({});
    expect(requestStandupSend(user.token, channel, 'Sending a message')).toStrictEqual({});
    expect(requestStandupSend(user1.token, channel, 'Also sending a message')).toStrictEqual({});
  });
});
