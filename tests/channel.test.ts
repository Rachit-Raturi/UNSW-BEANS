import {
        requestauthRegister,
        requestChannelsCreate,     
        requestChannelDetails, 
        requestChannelJoin,
        requestChannelInvite,
        requestChannelMessages,
        requestClear,
        requestChannelLeave,
        requestChannelAddOwner,
        requestChannelRemoveOwner
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
    expect(requestChannelJoin(user.token, invalidChannelId)).toStrictEqual(ERROR);
  });

  test('Test 2: User is already a member of the channel', () => {
    expect(requestChannelJoin(user.token, channel.channelId)).toStrictEqual(ERROR);
  });

  test('Test 3: Private channel join attempt', () => {
    const newPrivateChannel = requestChannelsCreate(user.token, 'Channel1', false);
    expect(requestChannelJoin(user1.token, newPrivateChannel.channelId)).toStrictEqual(ERROR);
  });

  test('Test 4: Valid Case', () => {
    expect(requestChannelJoin(user1.token, channel.channelId)).toStrictEqual({});
  });

  test('Test 5: Global owner joins private channel', () => {
    const newPrivateChannel = requestChannelsCreate(user1.token, 'Channel1', false);
    expect(requestChannelJoin(user.token, newPrivateChannel.channelId)).toStrictEqual({});
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
    requestChannelJoin(user2.token, channel.channelId);
    expect(requestChannelInvite(user.token, channel.channelId, user2.authUserId))
      .toStrictEqual(ERROR);
  });

  test('Test 7: Valid input', () => {
    expect(requestChannelInvite(user.token, channel.channelId, user1.authUserId))
      .toStrictEqual({});
  });
});

describe('/channel/messages/v2', () => {
  let start: number = 0;
  test('Test 1: Invalid channelId', () => {
      expect(requestChannelMessages(user.token, invalidChannelId, start))
        .toStrictEqual(ERROR);
  });

  test('Test 2: Invalid authUserId', () => {
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


describe('/channel/leave/v1', () => {
  test('Test 1: channelId does not refer to a valid channel', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelLeave(user1.token, invalidChannelId))
    .toStrictEqual(ERROR);
  });
  
  test('Test 2: user is not a member of the channel', () => {
    expect(requestChannelLeave(user1.token, channel.channelId))
    .toStrictEqual(ERROR);
  });

  test('Test 3: token is invalid', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelLeave(invalidtoken, channel.channelId))
    .toStrictEqual(ERROR);
  });
  
  test('Test 4: successful', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelLeave(user1.token, channel.channelId))
    .toStrictEqual({});
  });
});

describe('/channel/addowner/v1', () => {
  test('Test 1: channelId does not refer to a valid channel', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelAddOwner(user.token, invalidChannelId, user1.uId))
    .toStrictEqual(ERROR);
  });
  
  test('Test 2: user is not a member of the channel', () => {
    expect(requestChannelAddOwner(user.token, channel.channelId, user1.uId))
    .toStrictEqual(ERROR);
  });

  test('Test 3: token is invalid', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelAddOwner(invalidtoken, channel.channelId, user1.uId))
    .toStrictEqual(ERROR);
  });

  test('Test 3.5: token is given by non owner', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelAddOwner(user1.token, channel.channelId, user1.uId))
    .toStrictEqual(ERROR);
  });

  test('Test 4: uId does not refer to a valid user', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelAddOwner(user.token, channel.channelId, invalidUserId))
    .toStrictEqual(ERROR);
  });
  
  test('Test 5: user is already an owner', () => {
    expect(requestChannelAddOwner(user.token, channel.channelId, user.uId))
    .toStrictEqual(ERROR);
  });

  test('Test 6: successful', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelAddOwner(user.token, channel.channelId, user1.uId))
    .toStrictEqual({});
  });
});

describe('/channel/removeowner/v1', () => {
  test('Test 1: channelId does not refer to a valid channel', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.userId);
    expect(requestChannelRemoveOwner(user.token, invalidChannelId, user1.uId))
    .toStrictEqual(ERROR);
  });
  
  test('Test 2: user is not a member of the channel', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.userId);
    const user2 = requestauthRegister('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    expect(requestChannelRemoveOwner(user.token, invalidChannelId, user2.uId))
    .toStrictEqual(ERROR);
  });

  test('Test 3: token is invalid', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.userId);
    expect(requestChannelRemoveOwner(invalidtoken, channel.channelId, user1.uId))
    .toStrictEqual(ERROR);
  });

  test('Test 3.5: token is given by non owner', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.userId);
    const user2 = requestauthRegister('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    requestChannelJoin(user2.token, channel.channelId);
    expect(requestChannelRemoveOwner(user2.token, channel.channelId, user1.uId))
    .toStrictEqual(ERROR);
  });

  test('Test 4: uId does not refer to a valid user', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.userId);
    expect(requestChannelRemoveOwner(user.token, channel.channelId, invalidUserId))
    .toStrictEqual(ERROR);
  });
  
  test('Test 5: user is not an owner', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.userId);
    const user2 = requestauthRegister('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    requestChannelJoin(user2.token, channel.channelId);
    expect(requestChannelRemoveOwner(user.token, channel.channelId, user2.uId))
    .toStrictEqual(ERROR);
  });

  test('Test 6: only one owner', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelRemoveOwner(user.token, channel.channelId, user.Id))
    .toStrictEqual(ERROR);
  });

  test('Test 7: successful', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.userId);
    expect(requestChannelRemoveOwner(user.token, channel.channelId, user1.uId))
    .toStrictEqual({});
  });
});