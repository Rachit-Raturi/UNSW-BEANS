import {
  requestClear,
  requestAuthRegister,
  requestChannelsCreate,
  requestChannelJoin,
  requestMessageSend,
  requestMessageEdit,
  requestMessageRemove,
  requestMessageReact,
  requestDmCreate,
  requestMessageSendDm,
  requestMessageSendLater,
  requestMessageUnReact
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
let user2: userType;
let channel: channelType;
let channel1: channelType;
let invalidToken = 'invalid';

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
      expect(requestMessageSend(user.token, channel1.channelId + 1, 'Message')).toStrictEqual(ERROR);
    });

    test('Test 2: Invalid token', () => {
      expect(requestMessageSend(invalidToken, channel.channelId, 'Message')).toStrictEqual(ERROR);
    });

    test('Test 3: User is not a Member', () => {
      expect(requestMessageSend(user2.token, channel.channelId, 'Message')).toStrictEqual(ERROR);
    });

    test('Test 4: Invalid message lengths', () => {
      let longString: string;
      for (let i = 0; i <= 1000; i++) {
        longString += 'a';
      }

      const emptyString = '';
      expect(requestMessageSend(user.token, channel.channelId, longString)).toStrictEqual(ERROR);
      expect(requestMessageSend(user.token, channel.channelId, emptyString)).toStrictEqual(ERROR);
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
      expect(requestMessageEdit('user.token', messageId.messageId, 'New Message')).toStrictEqual(ERROR);
    });

    test('Test 2: Invalid messageId', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageEdit(user.token, messageId.messageId + 1, 'New Message')).toStrictEqual(ERROR);
    });

    test('Test 3: Invalid uID and user is not owner', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageEdit(user2.token, messageId.messageId, 'New Message')).toStrictEqual(ERROR);
    });

    test('Test 4: Invalid message lengths', () => {
      let longString: string;
      for (let i = 0; i <= 1001; i++) {
        longString += 'a';
      }
      expect(requestMessageEdit(user.token, channel.channelId, longString)).toStrictEqual(ERROR);
    });

    test('Test 5: Dm case - user is not sender or owner of dm', () => {
      const dmCreate = requestDmCreate(user.token, [user2.authUserId, user1.authUserId]);
      const dmSend = requestMessageSendDm(user.token, dmCreate.dmId, 'New message');
      expect(requestMessageEdit(user1.token, dmSend.messageId, 'New')).toStrictEqual(ERROR);
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
  test('Test 3: Success Dm case', () => {
    const dmCreate = requestDmCreate(user.token, [user2.authUserId]);
    const dmSend = requestMessageSendDm(user.token, dmCreate.dmId, 'New message');
    expect(requestMessageEdit(user.token, dmSend.messageId, 'new Message')).toStrictEqual({});
  });
});

// =========================================================================
// Message Remove Tests
describe('/message/remove/v1', () => {
  describe('Error', () => {
    test('Test 1: User is not sender', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageRemove(user2.token, messageId.messageId)).toStrictEqual(ERROR);
    });

    test('Test 2: Invalid token', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageRemove('user2.token', messageId.messageId)).toStrictEqual(ERROR);
    });
    test('Test 3: Invalid messageId', () => {
      expect(requestMessageRemove(user.token, 3)).toStrictEqual(ERROR);
    });
    test('Test 4: Invalid permissions', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      requestChannelJoin(user2.token, channel.channelId);
      expect(requestMessageRemove(user2.token, messageId.messageId)).toStrictEqual(ERROR);
    });
  });

  // channel
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

  // Dm
  test('Test 3: Success Dm case', () => {
    const dmCreate = requestDmCreate(user.token, [user2.authUserId]);
    const dmSend = requestMessageSendDm(user.token, dmCreate.dmId, 'New message');
    expect(requestMessageRemove(user.token, dmSend.messageId)).toStrictEqual({});
  });

  test('Test 4: Dm case - user is not part of dm', () => {
    const dmCreate = requestDmCreate(user.token, [user2.authUserId]);
    const dmSend = requestMessageSendDm(user.token, dmCreate.dmId, 'New message');
    expect(requestMessageRemove(user1.token, dmSend.messageId)).toStrictEqual(ERROR);
  });

  test('Test 5: Dm case - user is not sender or owner of dm', () => {
    const dmCreate = requestDmCreate(user.token, [user2.authUserId, user1.authUserId]);
    const dmSend = requestMessageSendDm(user.token, dmCreate.dmId, 'New message');
    expect(requestMessageRemove(user1.token, dmSend.messageId)).toStrictEqual(ERROR);
  });
});

describe('/message/react/v1', () => {
  describe('Success Cases', () => {
    test('Test 1: Success', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageReact(user.token, messageId.messageId, 1)).toStrictEqual({});
    });

    test('Test 2: Success - multiple users', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      requestChannelJoin(user1.token, channel.channelId);
      requestChannelJoin(user2.token, channel.channelId);
      expect(requestMessageReact(user.token, messageId.messageId, 1)).toStrictEqual({});
      expect(requestMessageReact(user1.token, messageId.messageId, 1)).toStrictEqual({});
      expect(requestMessageReact(user2.token, messageId.messageId, 1)).toStrictEqual({});
    });
  });

  describe('Error Cases', () => {
    test('Test 3: Message doesnt exist', () => {
      expect(requestMessageReact(user.token, 0, 1)).toStrictEqual(ERROR);
    });

    test('Test 4: Message doesnt exist', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageReact(user1.token, messageId.messageId, 1)).toStrictEqual(ERROR);
    });

    test('Test 5: Double react', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageReact(user.token, messageId.messageId, 1)).toStrictEqual({});
      expect(requestMessageReact(user.token, messageId.messageId, 1)).toStrictEqual(ERROR);
    });

    test('Test 6: Invalid reactId', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageReact(user.token, messageId.messageId, 0)).toStrictEqual(ERROR);
    });
  });
});

// =========================================================================
// Message Send Later Tests
async function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds));
}

describe('message/sendlater/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid ChannelId', () => {
      const time = Math.floor(Date.now() / 1000);
      let timeSent = time + 1;
      expect(requestMessageSendLater(user.token, channel.channelId + 1, 'Message', timeSent)).toStrictEqual(400);
    });

    test('Test 2: Invalid Token', () => {
      const time = Math.floor(Date.now() / 1000);
      let timeSent = time + 1;
      expect(requestMessageSendLater(invalidToken, channel.channelId, 'Message', timeSent)).toStrictEqual(403);
    });

    test('Test 3: Message is less than 1 character', () => {
      const emptyString = '';
      const time = Math.floor(Date.now() / 1000);
      let timeSent = time + 1;
      expect(requestMessageSendLater(user.token, channel.channelId, emptyString, timeSent)).toStrictEqual(400);
    });

    test('Test 4: Message is more than 1000 characters', () => {
      let longString: string;
      for (let i = 0; i <= 1000; i++) {
        longString += 'a';
      }
      const time = Math.floor(Date.now() / 1000);
      let timeSent = time + 1;
      expect(requestMessageSendLater(user.token, channel.channelId, longString, timeSent)).toStrictEqual(400);
    });

    test('Test 5: User is not in DM', () => {
      const time = Math.floor(Date.now() / 1000);
      let timeSent = time + 1;
      expect(requestMessageSendLater(user2.token, channel.channelId, 'Message', timeSent)).toStrictEqual(403);
    });

    test('Test 6: timeSent is a time in the past', () => {
      const time = Math.floor(Date.now() / 1000);
      let timeSent = time - 1;
      expect(requestMessageSendLater(user.token, channel.channelId, 'Message', timeSent)).toStrictEqual(400);
    });
  });

  describe('Success Cases', () => {
    test('Test 1: Successful message sent at specified time', async () => {
      const time = Math.floor(Date.now() / 1000);
      let timeSent = time + 2;
      await sleep(2);
      expect(requestMessageSendLater(user.token, channel.channelId, 'Message', timeSent)).toStrictEqual({ messageId: expect.any(Number) });
    });
  });
});

describe('/message/unreact/v1', () => {
  describe('Success Cases', () => {
    test('Test 1: Success', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      requestMessageReact(user.token, messageId.messageId, 1);
      expect(requestMessageUnReact(user.token, messageId.messageId, 1)).toStrictEqual({});
    });

    test('Test 2: Success - multiple users', () => {
      requestChannelJoin(user1.token, channel.channelId);
      requestChannelJoin(user2.token, channel.channelId);

      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');

      requestMessageReact(user.token, messageId.messageId, 1);
      requestMessageReact(user1.token, messageId.messageId, 1);
      requestMessageReact(user2.token, messageId.messageId, 1);

      expect(requestMessageUnReact(user.token, messageId.messageId, 1)).toStrictEqual({});
      expect(requestMessageUnReact(user1.token, messageId.messageId, 1)).toStrictEqual({});
      expect(requestMessageUnReact(user2.token, messageId.messageId, 1)).toStrictEqual({});
    });
  });

  describe('Error Cases', () => {
    test('Test 3: Message doesnt exist', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageUnReact(user.token, messageId.messageId, 1)).toStrictEqual(ERROR);
    });

    test('Test 4: Invalid user ', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageUnReact(user1.token, messageId.messageId, 1)).toStrictEqual(ERROR);
    });

    test('Test 5: Invalid message Id', () => {
      expect(requestMessageUnReact(user.token, 10, 1)).toStrictEqual(ERROR);
    });

    test('Test 6: Invalid reactId', () => {
      const messageId = requestMessageSend(user.token, channel.channelId, 'Message3');
      expect(requestMessageUnReact(user.token, messageId.messageId, 0)).toStrictEqual(ERROR);
    });
  });
});
