import { authLoginV1, authRegisterV1 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1 } from './channel';
import ClearV1 from './other';

let userId;
let userId1;
let channelId;

beforeEach(() => {
  ClearV1();
  userId = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
  userId1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  channelId = channelsCreateV1(userId.authUserId, 'test', true);
});

describe('Tests for channelDetailsV1', () => {
  test('Test 1: Invalid channelId', () => {
    expect(channelDetailsV1(userId.authUserId, channelId.channelId + 1)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 2: Invalid authUserId', () => {
    expect(channelDetailsV1(userId.authUserId + 1, channelIdchannelId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 3: User is not a member of the channel', () => {
    expect(channelDetailsV1(userId1.authUserId, channelId.channelId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 4: Valid case', () => {
    expect(channelDetailsV1(userId.authUserId, channelId.channelId)).toStrictEqual({
      name: 'test',
      isPublic: true,
      ownerMembers: [
        {
          uId: userId.authUserId,
          email: 'test@gmail.com',
          nameFirst: 'firstname',
          nameLast: 'lastname',
        }
      ],
      allMembers: [
        {
          uId: userId.authUserId,
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
    if (channelId.channelId === 1) {
      invalidchannelId = 2;
    }
    expect(channelJoinV1(userId.authUserId, invalidchannelId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 2: Member is already a member of the channel', () => {
    let result = channelJoinV1(userId.authUserId, channelId.channelId);
    expect(channelJoinV1(userId.authUserId, channelId.channelId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 3: Private channel join attempt', () => {
    const newPrivateChannel = channelsCreateV1(userId.authUserId, 'Channel1', false); 
    expect(channelJoinV1(userId1.authUserId, newPrivateChannel.channelId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 4: Valid Case', () => {
    expect(channelJoinV1(userId1.authUserId, channelId.channelId)).toStrictEqual({});
  });
});

describe('Tests for channelInviteV1', () => {
  test('Test 1: Invalid channelId', () => {
    let   invalidchannelId = 1;
    if (channelId.channelId === 1) {
      invalidchannelId = 2;
    }
    expect(channelInviteV1(userId.authUserId, invalidchannelId, userId1.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 2: Invalid authUserId', () => {
    let invaliduserId = 1;
    if (userId.authUserId === 1) {
      invaliduserId = 2;
    }
    if (userId1.authUserId === 2) {
      invaliduserId = 3;
    }
    expect(channelInviteV1(invaliduserId, channelId.channelId, userId1.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 3: nvalid uId', () => {
    let invaliduserId = 1;
    if (userId.authUserId === 1) {
      invaliduserId = 2;
    }
    if (userId1.authUserId === 2) {
      invaliduserId = 3;
    }
    expect(channelInviteV1(userId.authUserId, channelId.channelId, invaliduserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 4: Valid channelId + authId not a member', () => {
    const userId2 = authRegisterV1('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    expect(channelInviteV1(userId1.authUserId, channelId.channelId, userId2.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 5: uId member already in channel - 1 member in channel', () => {
    expect(channelInviteV1(userId.authUserId, channelId.channelId, userId.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 6: uId member already in channel - 2 members in channel', () => {
    const userId2 = authRegisterV1('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    channelJoinV1(userId2.authUserId, channelId.channelId);
    expect(channelInviteV1(userId.authUserId, channelId.channelId, userId2.authUserId)).toStrictEqual({error: expect.any(String)});
  });
});