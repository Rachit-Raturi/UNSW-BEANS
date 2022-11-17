import {
  requestClear,
  requestAuthRegister,
  requestChannelsCreate,
  requestChannelDetails,
  requestChannelJoin,
  requestChannelInvite,
  requestChannelMessages,
  requestChannelLeave,
  requestChannelAddOwner,
  requestChannelRemoveOwner,
  requestMessageSend
} from './helper';

interface userType {
  token: string,
  authUserId: number
}

interface channelType {
  channelId: number
}

let user: userType;
let user1: userType;
let channel: channelType;
let invalidUId = 1;
let invalidToken = 'invalid';
let invalidChannelId = 1;
let start: number;

beforeEach(() => {
  requestClear();
  user = requestAuthRegister('test@gmail.com', 'password', 'firstname', 'lastname');
  user1 = requestAuthRegister('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  channel = requestChannelsCreate(user.token, 'test', true);
  start = 0;

  if (user.authUserId === 1 || user1.authUserId === 1) {
    invalidUId = 2;
  }
  if (user.authUserId === 2 || user1.authUserId === 2) {
    invalidUId = 3;
  }
  if (user.token === invalidToken || user1.token === invalidToken) {
    invalidToken = 'invalid1';
  }
  if (user.token === invalidToken || user1.token === invalidToken) {
    invalidToken = 'invalid2';
  }
  if (channel.channelId === 1) {
    invalidChannelId = 2;
  }
});

// =========================================================================
// Channel Details Tests
describe('/channel/details/v2', () => {
  describe('Error', () => {
    test('Test 1: Invalid channelId', () => {
      expect(requestChannelDetails(user.token, channel.channelId + 1)).toStrictEqual(400);
    });

    test('Test 2: Invalid token', () => {
      expect(requestChannelDetails(invalidToken, channel.channelId)).toStrictEqual(403);
    });

    test('Test 3: User is not a member of the channel', () => {
      expect(requestChannelDetails(user1.token, channel.channelId)).toStrictEqual(403);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestChannelDetails(user.token, channel.channelId)).toStrictEqual(
      {
        name: 'test',
        isPublic: true,
        ownerMembers:
        [
          {
            uId: user.authUserId,
            email: 'test@gmail.com',
            nameFirst: 'firstname',
            nameLast: 'lastname',
            handleStr: 'firstnamelastname',
            profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
          }
        ],
        allMembers:
        [
          {
            uId: user.authUserId,
            email: 'test@gmail.com',
            nameFirst: 'firstname',
            nameLast: 'lastname',
            handleStr: 'firstnamelastname',
            profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
          }
        ],
      }
    );
  });
});

// =========================================================================
// Channel Join Tests
describe('/channel/join/v2', () => {
  describe('Error', () => {
    test('Test 1: Invalid channelId ', () => {
      expect(requestChannelJoin(user.token, invalidChannelId)).toStrictEqual(400);
    });

    test('Test 2: User is already a member of the channel', () => {
      expect(requestChannelJoin(user.token, channel.channelId)).toStrictEqual(403);
    });

    test('Test 3: Private channel join attempt', () => {
      const newPrivateChannel = requestChannelsCreate(user.token, 'Channel1', false);
      expect(requestChannelJoin(user1.token, newPrivateChannel.channelId)).toStrictEqual(403);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestChannelJoin(user1.token, channel.channelId)).toStrictEqual({});
    const expectedowners = [
      {
        uId: user.authUserId,
        email: 'test@gmail.com',
        nameFirst: 'firstname',
        nameLast: 'lastname',
        handleStr: 'firstnamelastname',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      }
    ];
    const expectedmembers = [
      {
        uId: user.authUserId,
        email: 'test@gmail.com',
        nameFirst: 'firstname',
        nameLast: 'lastname',
        handleStr: 'firstnamelastname',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      },
      {
        uId: user1.authUserId,
        email: 'test1@gmail.com',
        nameFirst: 'firstname1',
        nameLast: 'lastname1',
        handleStr: 'firstname1lastname1',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      }
    ];
    expect(requestChannelDetails(user1.token, channel.channelId).allMembers).toStrictEqual(expect.arrayContaining(expectedmembers));
    expect(requestChannelDetails(user1.token, channel.channelId).ownerMembers).toStrictEqual(expect.arrayContaining(expectedowners));
  });

  test('Test 2: Global owner joins private channel', () => {
    const newPrivateChannel = requestChannelsCreate(user1.token, 'Channel1', false);
    expect(requestChannelJoin(user.token, newPrivateChannel.channelId)).toStrictEqual({});
  });
});

// =========================================================================
// Channel Invite Tests
describe('/channel/invite/v2', () => {
  describe('Error', () => {
    test('Test 1: Invalid channelId', () => {
      expect(requestChannelInvite(user.token, invalidChannelId, user1.authUserId)).toStrictEqual(400);
    });

    test('Test 2: Invalid authUserId', () => {
      expect(requestChannelInvite(invalidToken, channel.channelId, user1.authUserId)).toStrictEqual(403);
    });

    test('Test 3: Invalid uId', () => {
      expect(requestChannelInvite(user.token, channel.channelId, invalidUId)).toStrictEqual(400);
    });

    test('Test 4: User is not a member of the channel', () => {
      const user2 = requestAuthRegister('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
      expect(requestChannelInvite(user1.token, channel.channelId, user2.authUserId)).toStrictEqual(403);
    });

    test('Test 5: User already in channel - 1 member in channel', () => {
      expect(requestChannelInvite(user.token, channel.channelId, user.authUserId)).toStrictEqual(400);
    });

    test('Test 6: User already in channel - 2 members in channel', () => {
      const user2 = requestAuthRegister('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
      requestChannelJoin(user2.token, channel.channelId);
      expect(requestChannelInvite(user.token, channel.channelId, user2.authUserId)).toStrictEqual(400);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestChannelInvite(user.token, channel.channelId, user1.authUserId)).toStrictEqual({});
    const expectedowners = [
      {
        uId: user.authUserId,
        email: 'test@gmail.com',
        nameFirst: 'firstname',
        nameLast: 'lastname',
        handleStr: 'firstnamelastname',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      }
    ];
    const expectedmembers = [
      {
        uId: user.authUserId,
        email: 'test@gmail.com',
        nameFirst: 'firstname',
        nameLast: 'lastname',
        handleStr: 'firstnamelastname',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      },
      {
        uId: user1.authUserId,
        email: 'test1@gmail.com',
        nameFirst: 'firstname1',
        nameLast: 'lastname1',
        handleStr: 'firstname1lastname1',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      }
    ];
    expect(requestChannelDetails(user1.token, channel.channelId).allMembers).toStrictEqual(expect.arrayContaining(expectedmembers));
    expect(requestChannelDetails(user1.token, channel.channelId).ownerMembers).toStrictEqual(expect.arrayContaining(expectedowners));
  });
});

// =========================================================================
// Channel Messages Tests
describe('/channel/messages/v2', () => {
  describe('Error', () => {
    test('Test 1: Invalid channelId', () => {
      expect(requestChannelMessages(user.token, invalidChannelId, start)).toStrictEqual(400);
    });

    test('Test 2: Invalid authUserId', () => {
      expect(requestChannelMessages(invalidToken, channel.channelId, start)).toStrictEqual(403);
    });

    test('Test 3: User is not a member of the channel', () => {
      expect(requestChannelMessages(user1.token, channel.channelId, start)).toStrictEqual(403);
    });

    test('Test 4: start > total messages in channel', () => {
      const start = 1;
      expect(requestChannelMessages(user.token, channel.channelId, start)).toStrictEqual(400);
    });
  });

  test('Test 1: No messages in channel', () => {
    expect(requestChannelMessages(user.token, channel.channelId, start)).toStrictEqual(
      {
        messages: [],
        start: 0,
        end: -1,
      }
    );
  });

  test('Test 2: less than 50 messages', () => {
    let round = 0;
    const originalMessage = 'message';
    let message = originalMessage;
    while (round < 40) {
      requestMessageSend(user.token, channel.channelId, message);
      round++;
      message = originalMessage + round.toString();
    }
    expect(requestChannelMessages(user.token, channel.channelId, start)).toStrictEqual(
      {
        messages: expect.any(Array),
        start: 0,
        end: -1,
      }
    );
  });

  test('Test 3: more than 50 messages', () => {
    let round = 0;
    const originalMessage = 'message';
    let message = originalMessage;
    while (round < 60) {
      requestMessageSend(user.token, channel.channelId, message);
      round++;
      message = originalMessage + round.toString();
    }
    expect(requestChannelMessages(user.token, channel.channelId, start)).toStrictEqual(
      {
        messages: expect.any(Array),
        start: 0,
        end: 50,
      }
    );
    expect(requestChannelMessages(user.token, channel.channelId, start).messages[49]).toEqual(
      {
        messageId: expect.any(Number),
        uId: expect.any(Number),
        message: 'message49',
        timeSent: expect.any(Number),
        reacts: []
      }
    );
    expect(requestChannelMessages(user.token, channel.channelId, start).messages[50]).toEqual(undefined);

    expect(requestChannelMessages(user.token, channel.channelId, 50)).toStrictEqual(
      {
        messages: expect.any(Array),
        start: 50,
        end: -1,
      }
    );
    expect(requestChannelMessages(user.token, channel.channelId, start).messages[50]).toEqual(undefined);
  });
});

// =========================================================================
// Channel Leave Tests
describe('/channel/leave/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid channelId', () => {
      requestChannelJoin(user1.token, channel.channelId);
      expect(requestChannelLeave(user1.token, invalidChannelId)).toStrictEqual(400);
    });

    test('Test 2: User is not a member of the channel', () => {
      expect(requestChannelLeave(user1.token, channel.channelId)).toStrictEqual(403);
    });

    test('Test 3: Invalid token', () => {
      requestChannelJoin(user1.token, channel.channelId);
      expect(requestChannelLeave(invalidToken, channel.channelId)).toStrictEqual(403);
    });
  });

  test('Test 1: Successful case', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelLeave(user1.token, channel.channelId)).toStrictEqual({});
    const expectedowners = [
      {
        uId: user.authUserId,
        email: 'test@gmail.com',
        nameFirst: 'firstname',
        nameLast: 'lastname',
        handleStr: 'firstnamelastname',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      }
    ];
    const expectedmembers = [
      {
        uId: user.authUserId,
        email: 'test@gmail.com',
        nameFirst: 'firstname',
        nameLast: 'lastname',
        handleStr: 'firstnamelastname',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      },
    ];
    expect(requestChannelDetails(user.token, channel.channelId).allMembers).toStrictEqual(expect.arrayContaining(expectedmembers));
    expect(requestChannelDetails(user.token, channel.channelId).ownerMembers).toStrictEqual(expect.arrayContaining(expectedowners));
  });

  test('Test 2: only owner leaves', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelLeave(user.token, channel.channelId)).toStrictEqual({});
    expect(requestChannelDetails(user1.token, channel.channelId).ownerMembers).toStrictEqual([]);
    expect(requestChannelDetails(user1.token, channel.channelId).allMembers).toStrictEqual([
      {
        uId: user1.authUserId,
        email: 'test1@gmail.com',
        nameFirst: 'firstname1',
        nameLast: 'lastname1',
        handleStr: 'firstname1lastname1',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      }
    ]);
  });
});

// =========================================================================
// Channel Add Owner Tests
describe('/channel/addowner/v1', () => {
  test('Test 1: channelId does not refer to a valid channel', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelAddOwner(user.token, invalidChannelId, user1.authUserId)).toStrictEqual(400);
  });

  test('Test 2: user is not a member of the channel', () => {
    expect(requestChannelAddOwner(user.token, channel.channelId, user1.authUserId)).toStrictEqual(400);
  });

  test('Test 3: token is invalid', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelAddOwner(invalidToken, channel.channelId, user1.authUserId)).toStrictEqual(403);
  });

  test('Test 3.5: token is given by non owner', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelAddOwner(user1.token, channel.channelId, user1.authUserId)).toStrictEqual(403);
  });

  test('Test 4: uId does not refer to a valid user', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelAddOwner(user.token, channel.channelId, invalidUId)).toStrictEqual(400);
  });

  test('Test 5: user is already an owner', () => {
    expect(requestChannelAddOwner(user.token, channel.channelId, user1.authUserId)).toStrictEqual(400);
  });

  test('Test 1: Successful case', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelAddOwner(user.token, channel.channelId, user1.authUserId)).toStrictEqual({});
    const expectedowners = [
      {
        uId: user.authUserId,
        email: 'test@gmail.com',
        nameFirst: 'firstname',
        nameLast: 'lastname',
        handleStr: 'firstnamelastname',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      },
      {
        uId: user1.authUserId,
        email: 'test1@gmail.com',
        nameFirst: 'firstname1',
        nameLast: 'lastname1',
        handleStr: 'firstname1lastname1',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      }
    ];
    const expectedmembers = [
      {
        uId: user.authUserId,
        email: 'test@gmail.com',
        nameFirst: 'firstname',
        nameLast: 'lastname',
        handleStr: 'firstnamelastname',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      },
      {
        uId: user1.authUserId,
        email: 'test1@gmail.com',
        nameFirst: 'firstname1',
        nameLast: 'lastname1',
        handleStr: 'firstname1lastname1',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      }
    ];

    expect(requestChannelDetails(user1.token, channel.channelId).allMembers).toStrictEqual(expect.arrayContaining(expectedmembers));
    expect(requestChannelDetails(user1.token, channel.channelId).ownerMembers).toStrictEqual(expect.arrayContaining(expectedowners));
  });
});

// =========================================================================
// Channel Remove Owner Tests
describe('/channel/removeowner/v1', () => {
  test('Test 1: channelId does not refer to a valid channel', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.authUserId);
    expect(requestChannelRemoveOwner(user.token, invalidChannelId, user1.authUserId)).toStrictEqual(400);
  });

  test('Test 2: user is not a member of the channel', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.authUserId);
    const user2 = requestAuthRegister('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    expect(requestChannelRemoveOwner(user.token, invalidChannelId, user2.authUserId)).toStrictEqual(400);
  });

  test('Test 3: token is invalid', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.authUserId);
    expect(requestChannelRemoveOwner(invalidToken, channel.channelId, user1.authUserId)).toStrictEqual(403);
  });

  test('Test 3.5: token is given by non owner', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.authUserId);
    const user2 = requestAuthRegister('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    requestChannelJoin(user2.token, channel.channelId);
    expect(requestChannelRemoveOwner(user2.token, channel.channelId, user1.authUserId)).toStrictEqual(403);
  });

  test('Test 4: uId does not refer to a valid user', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.authUserId);
    expect(requestChannelRemoveOwner(user.token, channel.channelId, invalidUId)).toStrictEqual(400);
  });

  test('Test 5: user is not an owner', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.authUserId);
    const user2 = requestAuthRegister('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    requestChannelJoin(user2.token, channel.channelId);
    expect(requestChannelRemoveOwner(user.token, channel.channelId, user2.authUserId)).toStrictEqual(400);
  });

  test('Test 6: only one owner', () => {
    requestChannelJoin(user1.token, channel.channelId);
    expect(requestChannelRemoveOwner(user.token, channel.channelId, user.authUserId)).toStrictEqual(400);
  });

  test('Test 1: Successful case', () => {
    requestChannelJoin(user1.token, channel.channelId);
    requestChannelAddOwner(user.token, channel.channelId, user1.authUserId);
    expect(requestChannelRemoveOwner(user.token, channel.channelId, user1.authUserId)).toStrictEqual({});
    const expectedowners = [
      {
        uId: user.authUserId,
        email: 'test@gmail.com',
        nameFirst: 'firstname',
        nameLast: 'lastname',
        handleStr: 'firstnamelastname',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      },

    ];
    const expectedmembers = [
      {
        uId: user.authUserId,
        email: 'test@gmail.com',
        nameFirst: 'firstname',
        nameLast: 'lastname',
        handleStr: 'firstnamelastname',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      },
      {
        uId: user1.authUserId,
        email: 'test1@gmail.com',
        nameFirst: 'firstname1',
        nameLast: 'lastname1',
        handleStr: 'firstname1lastname1',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      }
    ];

    expect(requestChannelDetails(user1.token, channel.channelId).allMembers)
      .toStrictEqual(expect.arrayContaining(expectedmembers));
    expect(requestChannelDetails(user1.token, channel.channelId).ownerMembers)
      .toStrictEqual(expect.arrayContaining(expectedowners));
  });
});
