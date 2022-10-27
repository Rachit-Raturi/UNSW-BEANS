import {
  requestClear,
  requestAuthRegister,
  requestChannelsCreate,
  requestChannelJoin,
  requestMessageSend,
  requestMessageEdit,
  requestMessageRemove,
  requestMessageSendDm
} from './helper';

const ERROR = { error: expect.any(String) };

let user;
let user1;
let user2;
let channel;
let channel1;
let invalidToken = 'invalid';
let invalidDm = -1;
let dm;

beforeEach(() => {
  requestClear();
  user = requestAuthRegister('email@gmail.com', 'password', 'firstname', 'lastname');
  user1 = requestAuthRegister('email1@gmail.com', 'password1', 'firstname1', 'lastname1');
  user2 = requestAuthRegister('email2@gmail.com', 'password2', 'firstname2', 'lastname2');
  channel = requestChannelsCreate(user.token, 'name', true);
  channel1 = requestChannelsCreate(user.token, 'name1', true);

  if (user.token === invalidToken || user1.token === invalidToken || user2.token === invalidToken) {
    invalidToken = 'invalid1';
  }
  if (user.token === invalidToken || user1.token === invalidToken || user2.token === invalidToken) {
    invalidToken = 'invalid2';
  }
});

// =========================================================================
// Message Send Tests
describe('/message/send/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid channelId', () => {
      expect(requestMessageSend(user.token, channel1.channelId + 1, 'Message')).toStrictEqual({ error: expect.any(String) });
    });
  
    test('Test 2: Invalid token', () => {
      expect(requestMessageSend(invalidToken, channel.channelId, 'Message')).toStrictEqual({ error: expect.any(String) });
    });
  
    test('Test 3: User is not a Member', () => {
      expect(requestMessageSend(user2.token, channel.channelId, 'Message')).toStrictEqual({ error: expect.any(String) });
    });
  
    test('Test 4: Invalid message lengths', () => {
      let longString: string;
      for (let i = 0; i <= 1000; i++) {
        longString += 'a';
      }
  
      const emptyString = '';
      expect(requestMessageSend(user.token, channel.channelId, longString)).toStrictEqual({ error: expect.any(String) });
      expect(requestMessageSend(user.token, channel.channelId, emptyString)).toStrictEqual({ error: expect.any(String) });
    });
  });

  test('Test 1: Successful case 1', () => {
    expect(requestMessageSend(user.token, channel.channelId, 'Message')).toStrictEqual({ messageId: expect.any(Number) });
  });

  test('Test 2: Successful case 2 - Ids are unique', () => {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(requestMessageSend(user.token, channel.channelId, 'Message'));
    }
    const unique = Array.from(new Set(arr));
    expect(unique.length).toStrictEqual(10);
  });
});

// =========================================================================
// Message Edit Tests
describe('/message/edit/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid token', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageEdit('user.token', messageId.messageId, 'New Message')).toStrictEqual({ error: expect.any(String) });
    });
  
    test('Test 2: Invalid messageId', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageEdit(user.token, messageId.messageId + 1, 'New Message')).toStrictEqual({ error: expect.any(String) });
    });
  
    test('Test 3: Invalid uID and user is not owner', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageEdit(user2.token, messageId.messageId, 'New Message')).toStrictEqual({ error: expect.any(String) });
    });
  
    test('Test 4: Invalid message lengths', () => {
      let longString: string;
      for (let i = 0; i <= 1000; i++) {
        longString += 'a';
      }
      expect(requestMessageSend(user.token, channel.channelId, longString)).toStrictEqual({ error: expect.any(String) });
    });
  });

  test('Test 1: Successful case - Channel owner edit', () => {
    const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
    expect(requestMessageEdit(user.token, messageId.messageId, 'New Message')).toStrictEqual({});
  });

  test('Test 2: Successful case - edited by sender', () => {
    requestChannelJoin(user2.token, channel1.channelId);
    const messageId = requestMessageSend(user2.token, channel1.channelId, 'Message3');
    expect(requestMessageEdit(user.token, messageId.messageId, 'New Message')).toStrictEqual({});
  });
});

// =========================================================================
// Message Remove Tests
describe('/message/remove/v1', () => {
  describe('Error', () => {
    test('Test 1: User is not sender', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageRemove(user2.token, messageId.messageId)).toStrictEqual({ error: expect.any(String) });
    });
  
    test('Test 2: Invalid token', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageRemove('user2.token', messageId.messageId)).toStrictEqual({ error: expect.any(String) });
    });
  });

  test('Test 1: Successful case - Removed by channel owner', () => {
    requestChannelJoin(user2.token, channel.channelId);
    const messageId2 = requestMessageSend(user2.token, channel.channelId, 'Message4');
    expect(requestMessageRemove(user.token, messageId2.messageId)).toStrictEqual({});
  });

  test('Test 2: Successful case - sender removing own message', () => {
    requestChannelJoin(user2.token, channel1.channelId);
    const messageId = requestMessageSend(user2.token, channel1.channelId, 'Message3');
    expect(requestMessageRemove(user2.token, messageId.messageId)).toStrictEqual({});
  });
});

// =========================================================================
// Message Send Dm Tests
describe('/message/senddm/v1', () => {
  let message: string = "Hello World";
  describe('Error', () => {
    test('Test 1: Invalid dmId', () => {
      expect(requestMessageSendDm(user.token, invalidDm, message)).toStrictEqual(ERROR);
    });

    test('Test 2: Message is less than 1 character', () => {
      let emptyString: string;
      expect(requestMessageSendDm(user.token, dm.dmId, emptyString)).toStrictEqual(ERROR);
    })

    test('Test 3: Message is more than 1000 characters', () => {
      let longString: string;
      for (let i = 0; i <= 1000; i++) {
        longString += 'a';
      }
      expect(requestMessageSendDm(user.token, dm.dmId, longString)).toStrictEqual(ERROR);
    });

    test('Test 4: User is not in DM', () => {
      expect(requestMessageSendDm(user1.token, dm.dmId, message)).toStrictEqual(ERROR);
    });

    test('Test 5: Invalid token', () => {
      expect(requestMessageSendDm(invalidToken, dm.dmId, message)).toStrictEqual(ERROR);
    });
  });

  test('Test 1: Successful message', () => {
    let message: string = "Hello World";
    expect(requestMessageSendDm(user.token, dm.dmId, message)).toStrictEqual({ messageId: expect.any(Number) });
  })
});
