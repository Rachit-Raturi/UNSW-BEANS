import { authRegisterV1, authLoginV1 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels.js';
import { channelJoinV1, channelInviteV1, channelDetailsV1, channelMessagesV1 } from './channel.js';

import ClearV1 from './other';

let userId;
let userId1;
let channelId;
let invaliduserId = 1;
let invalidchannelId = 1;
let start

beforeEach(() => {
  ClearV1();
  userId = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
  userId1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  channelId = channelsCreateV1(userId.authUserId,'test',true);
  start = 0;

  if (userId.authUserId === 1 || userId1.authUserId === 1) {
    invaliduserId = 2;
  }
  if (userId.authUserId === 2 || userId1.authUserId === 2) {
    invaliduserId = 3;
  }
  if (channelId.channelId === 1) {
    invalidchannelId = 2;
  }

});



describe('Invalid Channel invite', () => {
  test('Invalid channelId', () => {
    expect(channelInviteV1(userId.authUserId, invalidchannelId, userId1.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Invalid authUserId', () => {
    expect(channelInviteV1(invaliduserId, channelId.channelId, userId1.authUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Invalid uId', () => {
    expect(invaliduserId).toStrictEqual(2);
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




describe('tests for channelMessagesV1 function', () => {
  test('Invalid channelId', () => {
    let start = 0;
    expect(channelMessagesV1(userId.authUserId, invalidchannelId, start)).toStrictEqual({ error: expect.any(String) });
  });
  
  test('Invalid authUserId', () => {
    expect(channelMessagesV1(invaliduserId, channelId.channelId, start)).toStrictEqual({ error: expect.any(String) });
  });
  
  test('authUserId not in channel', () => {
    expect(channelMessagesV1(userId1.authUserUd, channelId.channelId, start)).toStrictEqual({ error: expect.any(String) });
  });
  
  test('start > total messages in channel', () => {
    start = 1;
    expect(channelMessagesV1(userId.authUserId, channelId.channelId, start)).toStrictEqual({ error: expect.any(String) });
  });
  
  test('Successful message history', () => {
    expect(channelMessagesV1(userId.authUserId, channelId.channelId, start)).toStrictEqual(
      {
      messages: [
        {
          messageId: 1,
          uId: 1,
          message: 'Hello world',
          timeSent: 1582426789,
        }
      ],
      start: 0,
      end: 50,
    }
    );
  });

});

describe('tests for channelJoinV1 function', () => {
  test('test 1: Join attempt with invalid channelId ', () => {
    let invalidchannelId = 1;
    if (channelId.channelId === 1) {
      invalidchannelId = 2;
    }

    expect(channelJoinV1(userId.authUserId, invalidchannelId)).toStrictEqual({error: expect.any(String)});
  });

  test('test 2: Member is already a member of the channel', () => {
    let result = channelJoinV1(userId.authUserId, channelId.channelId);

    expect(channelJoinV1(userId.authUserId, channelId.channelId)).toStrictEqual({error: expect.any(String)});
  });

  test('test 3: Private channel join attempt', () => {
    const newPrivateChannel = channelsCreateV1(userId.authUserId, 'Channel1', false); 
  
    expect(channelJoinV1(userId1.authUserId, newPrivateChannel.channelId)).toStrictEqual({error: expect.any(String)});
  });

  test('test 4: Valid Case', () => {  
    expect(channelJoinV1(userId1.authUserId, channelId.channelId)).toStrictEqual({});
  });
});

