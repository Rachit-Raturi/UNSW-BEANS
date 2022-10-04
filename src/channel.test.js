import { authLoginV1, authRegisterV1 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1 } from './channel';
import ClearV1 from './other';

let user;
let user1;
let channel;

beforeEach(() => {
  ClearV1();
  user = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
  user1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  channel = channelsCreateV1(user.authUserId, 'test', true);
});

describe('Tests for channelDetailsV1', () => {
  test('Test 1: Invalid channelId', () => {
    expect(channelDetailsV1(user.authUserId, channel.channelId + 1)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 2: Invalid authUserId', () => {
    expect(channelDetailsV1(user.authUserId + 1, channel.channelId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 3: User is not a member of the channel', () => {
    expect(channelDetailsV1(user1.authUserId, channel.channelId)).toStrictEqual({error: expect.any(String)});
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
        }
      ],
      allMembers: [
        {
          uId: user.authUserId,
          email: 'test@gmail.com',
          nameFirst: 'firstname',
          nameLast: 'lastname',
        }
      ],
    });
  });
});

describe('Tests for channelJoinV1', () => {
  test('Test 1: Join attempt with invalid channelId ', () => {
    let invalidchannelId = 1;
    if (channel.channelId === 1) {
      invalidchannelId = 2;
    }
    expect(channelJoinV1(user.authUserId, invalidchannelId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 2: Member is already a member of the channel', () => {
    let result = channelJoinV1(user.authUserId, channel.channelId);
    expect(channelJoinV1(user.authUserId, channel.channelId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 3: Private channel join attempt', () => {
    const newPrivateChannel = channelsCreateV1(user.authUserId, 'Channel1', false); 
    expect(channelJoinV1(user1.authUserId, newPrivateChannel.channelId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 4: Valid Case', () => {
    expect(channelJoinV1(user1.authUserId, channel.channelId)).toStrictEqual({});
  });
});

describe('Tests for channelInviteV1', () => {
  test('Test 1: Invalid channelId', () => {
    let   invalidchannelId = 1;
    if (channel.channelId === 1) {
      invalidchannelId = 2;
    }
    expect(channelInviteV1(user.authUserId, invalidchannelId, user1.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 2: Invalid authUserId', () => {
    let invaliduserId = 1;
    if (user.authUserId === 1) {
      invaliduserId = 2;
    }
    if (user1.authUserId === 2) {
      invaliduserId = 3;
    }
    expect(channelInviteV1(invaliduserId, channel.channelId, user1.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 3: Invalid uId', () => {
    let invaliduserId = 1;
    if (user.authUserId === 1) {
      invaliduserId = 2;
    }
    if (user1.authUserId === 2) {
      invaliduserId = 3;
    }
    expect(channelInviteV1(user.authUserId, channel.channelId, invaliduserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 4: Valid channelId + authId not a member', () => {
    const user2 = authRegisterV1('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    expect(channelInviteV1(user1.authUserId, channel.channelId, user2.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 5: uId member already in channel - 1 member in channel', () => {
    expect(channelInviteV1(user.authUserId, channel.channelId, user.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 6: uId member already in channel - 2 members in channel', () => {
    const user2 = authRegisterV1('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    channelJoinV1(user2.authUserId, channel.channelId);
    expect(channelInviteV1(user.authUserId, channel.channelId, user2.authUserId)).toStrictEqual({error: expect.any(String)});
  });
});