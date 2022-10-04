import { authRegisterV1, authLoginV1 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import { channelJoinV1, channelInviteV1, channelDetailsV1, channelMessagesV1 } from './channel';
import { getData, setData } from './dataStore';
import ClearV1 from './other';

let userId;
let userId1;
let channelId;


beforeEach(() => {
  ClearV1();
  userId = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
  userId1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  channelId = channelsCreateV1(userId.authUserId,'test',true);
});

describe('Invalid Channel invite', () => {
  test('Invalid channelId', () => {
    let   invalidchannelId = 1;
    if (channelId.channelId === 1) {
      invalidchannelId = 2;
    }
    expect(channelInviteV1(userId.authUserId, invalidchannelId, userId1.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Invalid authUserId', () => {
    let invaliduserId = 1;
    if (userId.authUserId === 1) {
      invaliduserId = 2;
    }
    if (userId1.authUserId === 2) {
      invaliduserId = 3;
    }
    expect(channelInviteV1(invaliduserId, channelId.channelId, userId1.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Invalid uId', () => {
    let invaliduserId = 1;
    if (userId.authUserId === 1) {
      invaliduserId = 2;
    }
    if (userId1.authUserId === 2) {
      invaliduserId = 3;
    }
    expect(channelInviteV1(userId.authUserId, channelId.channelId, invaliduserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Valid channelId + authId not a member', () => {
    const userId2 = authRegisterV1('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    expect(channelInviteV1(userId1.authUserId, channelId.channelId, userId2.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('uId member already in channel - 1 member in channel', () => {
    expect(channelInviteV1(userId.authUserId, channelId.channelId, userId.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('uId member already in channel - 2 members in channel', () => {
    const userId2 = authRegisterV1('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    channelJoinV1(userId2.authUserId, channelId.channelId);
    expect(channelInviteV1(userId.authUserId, channelId.channelId, userId2.authUserId)).toStrictEqual({error: expect.any(String)});
  });
});

// Tests for the function channelMessagesV1
describe('tests for channelMessagesV1 function', () => {
  test('Invalid channelId', () => {
    let invalidchannelId = 2;
    expect(channelMessagesV1(userId.authUserId, invalidchannelId, start)).toStrictEqual({ error: expect.any(String) });
  });
  
  test('Invalid authUserId', () => {
    let invaliduserId = 2;
    expect(channelMessagesV1(invaliduserId, channelId.channelId, start)).toStrictEqual({ error: expect.any(String) });
  });
  
  test('authUserId not in channel', () => {
    expect(channelMessagesV1(userId1.authUserUd, channelId.channelId, start)).toStrictEqual({ error: expect.any(String) });
  });
  
  test('start > total messages in channel', () => {
    let start = 1;
    expect(channelMessagesV1(userId.authUserId, channelId.channelId, start)).toStrictEqual({ error: expect.any(String) });
  });
  
  test('Successful message history', () => {
    expect(channelMessagesV1(userId.authUserId, channelId.channelId, start)).toStrictEqual({ channelMessages(userId.authUserId, channel.channelId, 0) => { [messages], 0, -1} });
  });
});
