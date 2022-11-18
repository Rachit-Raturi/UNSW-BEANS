import {
  requestClear,
  requestAuthRegister,
  requestUserProfile,
  requestUsersAll,
  requestUserSetName,
  requestUserSetEmail,
  requestUserSetHandle,
  requestChannelsCreate,
  requestChannelJoin,
  requestChannelInvite,
  requestChannelLeave,
  requestDmCreate,
  requestDmRemove,
  requestDmLeave,
  requestMessageSend,
  requestMessageSendDm,
  requestMessageRemove,
  requestUserStats,
  requestUsersStats,
  requestUserPhoto
} from './helper';

interface userType {
  token: string,
  authUserId: number
}

let user: userType;
let invalidToken = 'invalid';
let invalidUId = 0;
const testTimeStamp = expect.any(Number);

beforeEach(() => {
  requestClear();
  user = requestAuthRegister('test@gmail.com', 'password', 'firstname', 'lastname');

  if (user.token === invalidToken) {
    invalidToken = 'invalid1';
  }
  if (user.authUserId === invalidUId) {
    invalidUId = 1;
  }
});

// =========================================================================
// User Profile Tests
describe('/user/profile/v3', () => {
  describe('Error', () => {
    test('Test 1: Invalid token', () => {
      expect(requestUserProfile(invalidToken, user.authUserId)).toStrictEqual(403);
    });

    test('Test 2: Invalid uId', () => {
      expect(requestUserProfile(user.token, invalidUId)).toStrictEqual(400);
    });
  });

  test('Test 1: Successful case - view another user', () => {
    const user1 = requestAuthRegister('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
    expect(requestUserProfile(user.token, user1.authUserId)).toStrictEqual(
      {
        user: {
          uId: user1.authUserId,
          email: 'test1@gmail.com',
          nameFirst: 'firstname1',
          nameLast: 'lastname1',
          handleStr: 'firstname1lastname1',
          profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
        }
      }
    );
  });
});

// =========================================================================
// Users All Tests
describe('/users/all/v2', () => {
  test('Error Test 1: Invalid token', () => {
    expect(requestUsersAll(invalidToken)).toStrictEqual(403);
  });

  test('Test 1: Successful case - 1 user', () => {
    expect(requestUsersAll(user.token)).toStrictEqual(
      {
        users: [
          {
            uId: user.authUserId,
            email: 'test@gmail.com',
            nameFirst: 'firstname',
            nameLast: 'lastname',
            handleStr: 'firstnamelastname',
            profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
          }
        ]
      }
    );
  });

  test('Test 2: Successful case - multiple users', () => {
    const outputarray = [];
    const user1 = requestAuthRegister('test2@gmail.com', 'password2', 'firstname1', 'lastname1');
    outputarray.push(
      {
        uId: user.authUserId,
        email: 'test@gmail.com',
        nameFirst: 'firstname',
        nameLast: 'lastname',
        handleStr: 'firstnamelastname',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      }
    );
    outputarray.push(
      {
        uId: user1.authUserId,
        email: 'test2@gmail.com',
        nameFirst: 'firstname1',
        nameLast: 'lastname1',
        handleStr: 'firstname1lastname1',
        profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
      }
    );

    const outputSet = new Set(outputarray);
    const inputSet = new Set(requestUsersAll(user.token).users);

    expect(inputSet).toStrictEqual(outputSet);
  });
});

// =========================================================================
// User Set Name Tests
describe('/user/profile/setname/v2', () => {
  describe('Error', () => {
    test('Test 1: Invalid nameFirst length', () => {
      expect(requestUserSetName(user.token, '', 'apples')).toStrictEqual(400);
      expect(requestUserSetName(user.token, 'abcdefgHiAjSjoWjoDAWojdsodasdjodaowapdoapcdwocwapdaowdj', 'apples')).toStrictEqual(400);
    });

    test('Test 2: Invalid nameLast length', () => {
      expect(requestUserSetName(user.token, 'apples', '')).toStrictEqual(400);
      expect(requestUserSetName(user.token, 'apples', 'abcdefgHiAjSjoWjoDAWojdsodasdjodaowapdoapcdwocwapdaowdj')).toStrictEqual(400);
    });

    test('Test 3: Invalid token', () => {
      expect(requestUserSetName(invalidToken, 'apples', 'oranges')).toStrictEqual(403);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestUserSetName(user.token, 'apples', 'oranges')).toStrictEqual({});
  });
});

// =========================================================================
// User Set Email Tests
describe('/user/profile/setemail/v2', () => {
  describe('Error', () => {
    test('Test 1: Invalid email', () => {
      expect(requestUserSetEmail(user.token, 'invalidemail')).toStrictEqual(400);
    });

    test('Test 2: Same email entered', () => {
      expect(requestUserSetEmail(user.token, 'test@gmail.com')).toStrictEqual(400);
    });

    test('Test 3: Email used by another user', () => {
      requestAuthRegister('test2@gmail.com', 'password2', 'firstname1', 'lastname1');
      expect(requestUserSetEmail(user.token, 'test2@gmail.com')).toStrictEqual(400);
    });

    test('Test 4: Invalid token', () => {
      expect(requestUserSetEmail(invalidToken, 'test@gmail.com')).toStrictEqual(403);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestUserSetEmail(user.token, 'test999@gmail.com')).toStrictEqual({});
  });
});

// =========================================================================
// User Set Handle Tests
describe('/user/profile/sethandle/v2', () => {
  describe('Error', () => {
    test('Test 1: Invalid handleStr length', () => {
      expect(requestUserSetHandle(user.token, 'overtwentycharactersincl')).toStrictEqual(400);
      expect(requestUserSetHandle(user.token, 'be')).toStrictEqual(400);
    });

    test('Test 2: Same handleStr', () => {
      expect(requestUserSetHandle(user.token, 'firstnamelastname')).toStrictEqual(400);
    });

    test('Test 3: handleStr already used', () => {
      requestAuthRegister('test2@gmail.com', 'password2', 'firstname1', 'lastname1');
      expect(requestUserSetHandle(user.token, 'firstname1lastname1')).toStrictEqual(400);
    });

    test('Test 4: Invalid characters', () => {
      expect(requestUserSetHandle(user.token, '%invalid_handle$')).toStrictEqual(400);
    });

    test('Test 5: Invalid token', () => {
      expect(requestUserSetHandle(invalidToken, 'firstname1lastname1')).toStrictEqual(403);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestUserSetHandle(user.token, 'givemeyourstring1')).toStrictEqual({});
  });
});

// =========================================================================
// User Stats Tests
describe('/user/stats/v1 ', () => {
  describe('Error', () => {
    test('Test 1: Invalid token', () => {
      expect(requestUserStats(invalidToken)).toStrictEqual(403);
    });
  });

  test('Test 1: valid token - denominator of involvement is 0', () => {
    expect(requestUserStats(user.token)).toStrictEqual(
      {
        userStats: {
          channelsJoined: [{ numChannelsJoined: 0, timeStamp: testTimeStamp }],
          dmsJoined: [{ numDmsJoined: 0, timeStamp: testTimeStamp }],
          messagesSent: [{ numMessagesSent: 0, timeStamp: testTimeStamp }],
          involvementRate: 0
        }
      }
    );
  });

  test('Test 2: valid token - cap involvement at 1', () => {
    const channel = requestChannelsCreate(user.token, 'channel', true);
    const dm = requestDmCreate(user.token, []);
    requestMessageSend(user.token, channel.channelId, 'channel message');
    const message = requestMessageSend(user.token, channel.channelId, 'to delete');
    requestMessageSendDm(user.token, dm.dmId, 'dm message');
    requestMessageRemove(user.token, message.messageId);
    expect(requestUserStats(user.token)).toStrictEqual(
      {
        userStats: {
          channelsJoined: [
            { numChannelsJoined: 0, timeStamp: testTimeStamp },
            { numChannelsJoined: 1, timeStamp: testTimeStamp },
          ],
          dmsJoined: [
            { numDmsJoined: 0, timeStamp: testTimeStamp },
            { numDmsJoined: 1, timeStamp: testTimeStamp },
          ],
          messagesSent: [
            { numMessagesSent: 0, timeStamp: testTimeStamp },
            { numMessagesSent: 1, timeStamp: testTimeStamp },
            { numMessagesSent: 2, timeStamp: testTimeStamp },
            { numMessagesSent: 3, timeStamp: testTimeStamp },
          ],
          involvementRate: 1
        }
      }
    );
  });

  test('Test 3: valid token - advanced test', () => {
    const user1 = requestAuthRegister('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
    const channel = requestChannelsCreate(user.token, 'channel', true);
    requestChannelsCreate(user.token, 'channel1', true);
    const channel2 = requestChannelsCreate(user1.token, 'channel2', true);
    requestChannelInvite(user1.token, channel2.channelId, user.authUserId);
    requestChannelLeave(user.token, channel2.channelId);
    requestChannelJoin(user.token, channel2.channelId);
    requestChannelLeave(user.token, channel2.channelId);
    const dm = requestDmCreate(user.token, []);
    requestDmLeave(user.token, dm.dmId);
    const dm1 = requestDmCreate(user.token, []);
    requestDmRemove(user.token, dm1.dmId);
    requestDmCreate(user.token, []);
    requestMessageSend(user.token, channel.channelId, 'channel message');
    requestMessageSend(user.token, channel.channelId, 'message');
    requestMessageSendDm(user.token, dm.dmId, 'dm message');
    expect(requestUserStats(user.token)).toStrictEqual(
      {
        userStats: {
          channelsJoined: [
            { numChannelsJoined: 0, timeStamp: testTimeStamp },
            { numChannelsJoined: 1, timeStamp: testTimeStamp },
            { numChannelsJoined: 2, timeStamp: testTimeStamp },
            { numChannelsJoined: 3, timeStamp: testTimeStamp },
            { numChannelsJoined: 2, timeStamp: testTimeStamp },
            { numChannelsJoined: 3, timeStamp: testTimeStamp },
            { numChannelsJoined: 2, timeStamp: testTimeStamp }
          ],
          dmsJoined: [
            { numDmsJoined: 0, timeStamp: testTimeStamp },
            { numDmsJoined: 1, timeStamp: testTimeStamp },
            { numDmsJoined: 0, timeStamp: testTimeStamp },
            { numDmsJoined: 1, timeStamp: testTimeStamp },
            { numDmsJoined: 0, timeStamp: testTimeStamp },
            { numDmsJoined: 1, timeStamp: testTimeStamp },
          ],
          messagesSent: [
            { numMessagesSent: 0, timeStamp: testTimeStamp },
            { numMessagesSent: 1, timeStamp: testTimeStamp },
            { numMessagesSent: 2, timeStamp: testTimeStamp }
          ],
          involvementRate: 5 / 7
        }
      }
    );
  });
});

describe('/users/stats/v1 ', () => {
  describe('Error', () => {
    test('Test 1: Invalid token', () => {
      expect(requestUsersStats(invalidToken)).toStrictEqual(403);
    });
  });

  test('Test 1: valid token - start statistics', () => {
    expect(requestUsersStats(user.token)).toStrictEqual(
      {
        workspaceStats: {
          channelsExist: [{ numChannelsExist: 0, timeStamp: testTimeStamp }],
          dmsExist: [{ numDmsExist: 0, timeStamp: testTimeStamp }],
          messagesExist: [{ numMessagesExist: 0, timeStamp: testTimeStamp }],
          utilizationRate: 0
        }
      }
    );
  });

  test('Test 2: valid token - one user', () => {
    const channel = requestChannelsCreate(user.token, 'channel', true);
    requestChannelsCreate(user.token, 'channel1', true);
    requestMessageSend(user.token, channel.channelId, 'channel message');
    const dm = requestDmCreate(user.token, []);
    requestMessageSendDm(user.token, dm.dmId, 'dm message');
    expect(requestUsersStats(user.token)).toStrictEqual(
      {
        workspaceStats: {
          channelsExist: [
            { numChannelsExist: 0, timeStamp: testTimeStamp },
            { numChannelsExist: 1, timeStamp: testTimeStamp },
            { numChannelsExist: 2, timeStamp: testTimeStamp }
          ],
          dmsExist: [
            { numDmsExist: 0, timeStamp: testTimeStamp },
            { numDmsExist: 1, timeStamp: testTimeStamp }
          ],
          messagesExist: [
            { numMessagesExist: 0, timeStamp: testTimeStamp },
            { numMessagesExist: 1, timeStamp: testTimeStamp },
            { numMessagesExist: 2, timeStamp: testTimeStamp },
          ],
          utilizationRate: 1
        }
      }
    );
  });

  test('Test 3: valid token - multiple users', () => {
    const channel = requestChannelsCreate(user.token, 'channel', true);
    requestChannelsCreate(user.token, 'channel1', true);
    requestMessageSend(user.token, channel.channelId, 'channel message');
    const user1 = requestAuthRegister('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
    const dm = requestDmCreate(user.token, [user1.authUserId]);
    requestMessageSendDm(user.token, dm.dmId, 'dm message');
    requestAuthRegister('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
    expect(requestUsersStats(user.token)).toStrictEqual(
      {
        workspaceStats: {
          channelsExist: [
            { numChannelsExist: 0, timeStamp: testTimeStamp },
            { numChannelsExist: 1, timeStamp: testTimeStamp },
            { numChannelsExist: 2, timeStamp: testTimeStamp }
          ],
          dmsExist: [
            { numDmsExist: 0, timeStamp: testTimeStamp },
            { numDmsExist: 1, timeStamp: testTimeStamp }
          ],
          messagesExist: [
            { numMessagesExist: 0, timeStamp: testTimeStamp },
            { numMessagesExist: 1, timeStamp: testTimeStamp },
            { numMessagesExist: 2, timeStamp: testTimeStamp },
          ],
          utilizationRate: 2 / 3
        }
      }
    );
  });
});

describe('/user/profile/uploadphoto/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid token', () => {
      expect(requestUserPhoto(invalidToken, 'http://i.kym-cdn.com/photos/images/newsfeed/001/929/233/8c5.jpg', 0, 0, 1, 1)).toStrictEqual(403);
    });
    test('Test 2: Invalid image url', () => {
      expect(requestUserPhoto(user.token, 'invalid', 0, 0, 1, 1)).toStrictEqual(400);
    });
    test('Test 3: xEnd <= xStart', () => {
      expect(requestUserPhoto(user.token, 'http://i.kym-cdn.com/photos/images/newsfeed/001/929/233/8c5.jpg', 1, 0, 1, 1)).toStrictEqual(400);
      expect(requestUserPhoto(user.token, 'http://i.kym-cdn.com/photos/images/newsfeed/001/929/233/8c5.jpg', 1, 0, 0, 1)).toStrictEqual(400);
    });
    test('Test 4: yEnd <= yStart', () => {
      expect(requestUserPhoto(user.token, 'http://i.kym-cdn.com/photos/images/newsfeed/001/929/233/8c5.jpg', 0, 1, 1, 1)).toStrictEqual(400);
      expect(requestUserPhoto(user.token, 'http://i.kym-cdn.com/photos/images/newsfeed/001/929/233/8c5.jpg', 0, 1, 1, 0)).toStrictEqual(400);
    });
    test('Test 5: invalid image type', () => {
      expect(requestUserPhoto(user.token, 'http://en.wikipedia.org/wiki/Portable_Network_Graphics#/media/File:PNG_transparency_demonstration_1.png', 0, 0, 1, 1)).toStrictEqual(400);
    });
    test('Test 6: cropping not within image dimensions', () => {
      expect(requestUserPhoto(user.token, 'http://i.kym-cdn.com/photos/images/newsfeed/001/929/233/8c5.jpg', 0, 0, 800, 400)).toStrictEqual(400);
      expect(requestUserPhoto(user.token, 'http://i.kym-cdn.com/photos/images/newsfeed/001/929/233/8c5.jpg', 0, 0, 400, 800)).toStrictEqual(400);
    });
  });

  test('Test 1: valid test', () => {
    expect(requestUserPhoto(user.token, 'http://i.kym-cdn.com/photos/images/newsfeed/001/929/233/8c5.jpg', 0, 0, 680, 600)).toStrictEqual({});
  });
});
