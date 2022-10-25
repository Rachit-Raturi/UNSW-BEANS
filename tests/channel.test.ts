import {
        requestauthRegiser,
        requestChannelsCreate,     
        requestChannelDetails, 
        requestChannelJoin,
        requestChannelInvite,
        requestChannelMessages,
        requestClear
       } from './helper';

let user;
let user1;
let channel;
let invalidUserId = 1;
let invalidtoken = 'invalid';
let invalidChannelId = 1;
let start;
const ERROR = { error: expect.any(String) };

beforeEach(() => {
  requestClear();
  user = requestauthRegister('test@gmail.com', 'password', 'firstname', 'lastname');
  user1 = requestauthRegister('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  channel = requestChannelsCreate(user.token, 'test', true);
  start = 0;
  
  if (user.authUserId === 1 || user1.authUserId === 1) {
    invalidUserId = 2;
  }
  if (user.authUserId === 2 || user1.authUserId === 2) {
    invalidUserId = 3;
  }
  if (user.token === invalidtoken || user1.token === invalidtoken) {
    invalidtoken = 'invalid1';
  }
  if (user.token === invalidtoken || user1.token === invalidtoken) {
    invalidtoken = 'invalid2';
  }
  if (channel.channelId === 1) {
    invalidChannelId = 2;
  }
});

describe('/channel/details/v2', () => {
  test('Test 1: Invalid channelId', () => {
    expect(requestChannelDetails(user.token, channel.channelId + 1)).toStrictEqual(ERROR);
  });

  test('Test 2: Invalid token - extra characters', () => {
    expect(requestChannelDetails(user.token + 'AA', channel.channelId)).toStrictEqual(ERROR);
  });

  test('Test 3: Invalid token - missing characters', () => {
    expect(requestChannelDetails(user.token.slice(0, -2), channel.channelId)).toStrictEqual(ERROR);
  });

  test('Test 4: User is not a member of the channel', () => {
    expect(requestChannelDetails(user1.token, channel.channelId)).toStrictEqual(ERROR);
  });

  test('Test 5: Valid case', () => {
    expect(requestChannelDetails(user.token, channel.channelId)).toStrictEqual({
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

describe('/channel/join/v2', () => {
  test('Test 1: Join attempt with invalid channelId ', () => {
    let invalidChannelId = 1;
    if (channel.channelId === 1) {
      invalidChannelId = 2;
    }
    expect(requestChannelJoin(user.authUserId, invalidChannelId)).toStrictEqual(ERROR);
  });

  test('Test 2: User is already a member of the channel', () => {
    expect(requestChannelJoin(user.authUserId, channel.channelId)).toStrictEqual({});
    expect(requestChannelJoin(user.authUserId, channel.channelId)).toStrictEqual(ERROR);
  });

  test('Test 3: Private channel join attempt', () => {
    const newPrivateChannel = requestChannelsCreate(user.authUserId, 'Channel1', false);
    expect(requestChannelJoin(user1.authUserId, newPrivateChannel.channelId)).toStrictEqual(ERROR);
  });

  test('Test 4: Valid Case', () => {
    expect(requestChannelJoin(user1.authUserId, channel.channelId)).toStrictEqual({});
  });

  test('Test 5: Global owner joins private channel', () => {
    const newPrivateChannel = requestChannelsCreate(user1.authUserId, 'Channel1', false);
    expect(requestChannelJoin(user.authUserId, newPrivateChannel.channelId)).toStrictEqual({});
  });
});

describe('/channel/invite/v2', () => {
  test('Test 1: Invalid channelId', () => {
    expect(requestChannelInvite(user.token, invalidChannelId, user1.authUserId))
      .toStrictEqual(ERROR);
  });

  test('Test 2: Invalid authUserId', () => {
    expect(requestChannelInvite(invalidtoken, channel.channelId, user1.authUserId))
      .toStrictEqual(ERROR);
  });

  test('Test 3: Invalid uId', () => {
    expect(requestChannelInvite(user.token, channel.channelId, invalidUserId))
      .toStrictEqual(ERROR);
  });

  test('Test 4: Valid channelId + user not a member', () => {
    const user2 = requestauthRegister('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    expect(requestChannelInvite(user1.token, channel.channelId, user2.authUserId))
      .toStrictEqual(ERROR);
  });

  test('Test 5: User already in channel - 1 member in channel', () => {
    expect(requestChannelInvite(user.token, channel.channelId, user.authUserId))
      .toStrictEqual(ERROR);
  });

  test('Test 6: User already in channel - 2 members in channel', () => {
    const user2 = requestauthRegister('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    channelJoinV1(user2.authUserId, channel.channelId);
    expect(requestChannelInvite(user.token, channel.channelId, user2.authUserId))
      .toStrictEqual(ERROR);
  });

  test('Test 7: Valid input', () => {
    expect(requestChannelInvite(user.token, channel.channelId, user1.authUserId))
      .toStrictEqual({});
  });
});

describe('/channel/messages/v2', () => {
  test('Test 1: Invalid channelId', () => {
    const invalidChannelId = 2;
    if (channel.channelId === 1) {
      expect(requestChannelMessages(user.token, invalidChannelId, start))
        .toStrictEqual(ERROR);
    }
  });

  test('Test 2: Invalid authUserId', () => {
    const invalidUserId = 2;
    expect(requestChannelMessages(invalidtoken, channel.channelId, start))
      .toStrictEqual(ERROR);
  });

  test('Test 3: User not in channel', () => {
    expect(requestChannelMessages(user1.token, channel.channelId, start))
      .toStrictEqual(ERROR);
  });

  test('Test 4: start > total messages in channel', () => {
    const start = 1;
    expect(requestChannelMessages(user.token, channel.channelId, start))
      .toStrictEqual(ERROR);
  });

  test('Test 5: no messages in channel', () => {
    const start = 0;
    expect(requestChannelMessages(user.token, channel.channelId, start))
      .toStrictEqual(
        {
          messages: [],
          start: 0,
          end: -1,
        }
      );
  });
});
