import { authRegisterV1 } from '../auth.js';
import { channelsCreateV1 } from '../channels.js';
import { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1 } from './channel.js';
import { clearV1 } from '../other.js';

let user;
let user1;
let channel;
let invalidUserId = 1;
let invalidChannelId = 1;
let start;

beforeEach(() => {
  clearV1();
  user = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
  user1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  channel = channelsCreateV1(user.authUserId, 'test', true);
  start = 0;

  if (user.authUserId === 1 || user1.authUserId === 1) {
    invalidUserId = 2;
  }
  if (user.authUserId === 2 || user1.authUserId === 2) {
    invalidUserId = 3;
  }
  if (channel.channelId === 1) {
    invalidChannelId = 2;
  }
});

describe('Tests for channelDetailsV1', () => {
  test('Test 1: Invalid channelId', () => {
    expect(channelDetailsV1(user.authUserId, channel.channelId + 1)).toStrictEqual({ error: expect.any(String) });
  });

  test('Test 2: Invalid authUserId', () => {
    expect(channelDetailsV1(user.authUserId + 1, channel.channelId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Test 3: User is not a member of the channel', () => {
    expect(channelDetailsV1(user1.authUserId, channel.channelId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Test 4: Valid case', () => {
    expect(channelDetailsV1(user.authUserId, channel.channelId)).toStrictEqual({
      name: 'test',
      isPublic: true,
      ownerMembers: [
        {
          uId: user.authUserId,
          email: 'test@gmail.com',
          nameFirst: 'firstname',
          nameLast: 'lastname',
          handleStr: 'firstnamelastname',
        }
      ],
      allMembers: [
        {
          uId: user.authUserId,
          email: 'test@gmail.com',
          nameFirst: 'firstname',
          nameLast: 'lastname',
          handleStr: 'firstnamelastname'
        }
      ],
    });
  });
});

describe('Tests for channelJoinV1', () => {
  test('Test 1: Join attempt with invalid channelId ', () => {
    let invalidChannelId = 1;
    if (channel.channelId === 1) {
      invalidChannelId = 2;
    }
    expect(channelJoinV1(user.authUserId, invalidChannelId))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 2: User is already a member of the channel', () => {
    expect(channelJoinV1(user.authUserId, channel.channelId)).toStrictEqual({});
    expect(channelJoinV1(user.authUserId, channel.channelId))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 3: Private channel join attempt', () => {
    const newPrivateChannel = channelsCreateV1(user.authUserId, 'Channel1', false);
    expect(channelJoinV1(user1.authUserId, newPrivateChannel.channelId))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 4: Valid Case', () => {
    expect(channelJoinV1(user1.authUserId, channel.channelId)).toStrictEqual({});
  });

  test('Test 5: Global owner joins private channel', () => {
    const newPrivateChannel = channelsCreateV1(user1.authUserId, 'Channel1', false);
    expect(channelJoinV1(user.authUserId, newPrivateChannel.channelId)).toStrictEqual({});
  });
});

describe('Tests for channelInviteV1', () => {
  test('Test 1: Invalid channelId', () => {
    expect(channelInviteV1(user.authUserId, invalidChannelId, user1.authUserId))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 2: Invalid authUserId', () => {
    expect(channelInviteV1(invalidUserId, channel.channelId, user1.authUserId))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 3: Invalid uId', () => {
    expect(channelInviteV1(user.authUserId, channel.channelId, invalidUserId))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 4: Valid channelId + user not a member', () => {
    const user2 = authRegisterV1('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    expect(channelInviteV1(user1.authUserId, channel.channelId, user2.authUserId))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 5: User already in channel - 1 member in channel', () => {
    expect(channelInviteV1(user.authUserId, channel.channelId, user.authUserId))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 6: User already in channel - 2 members in channel', () => {
    const user2 = authRegisterV1('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    channelJoinV1(user2.authUserId, channel.channelId);
    expect(channelInviteV1(user.authUserId, channel.channelId, user2.authUserId))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 7: Valid input', () => {
    expect(channelInviteV1(user.authUserId, channel.channelId, user1.authUserId))
      .toStrictEqual({});
  });
});

describe('Tests for channelMessagesV1', () => {
  test('Test 1: Invalid channelId', () => {
    const invalidChannelId = 2;
    if (channel.channelId === 1) {
      expect(channelMessagesV1(user.authUserId, invalidChannelId, start))
        .toStrictEqual({ error: expect.any(String) });
    }
  });

  test('Test 2: Invalid authUserId', () => {
    const invalidUserId = 2;
    expect(channelMessagesV1(invalidUserId, channel.channelId, start))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 3: User not in channel', () => {
    expect(channelMessagesV1(user1.authUserUd, channel.channelId, start))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 4: start > total messages in channel', () => {
    const start = 1;
    expect(channelMessagesV1(user.authUserId, channel.channelId, start))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 5: no messages in channel', () => {
    const start = 0;
    expect(channelMessagesV1(user.authUserId, channel.channelId, start))
      .toStrictEqual(
        {
          messages: [],
          start: 0,
          end: -1,
        }
      );
  });
});
