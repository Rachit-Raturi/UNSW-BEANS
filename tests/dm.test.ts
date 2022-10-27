import {
  requestClear,
  requestAuthRegister,
  requestDmCreate,
  requestDmList,
  requestDmRemove,
  requestDmDetails,
  requestDmLeave,
  requestDmMessages,
  requestMessageSendDm
} from './helper';

const ERROR = { error: expect.any(String) };

let user;
let user1;
let user2;
let invalidToken = 'invalid';
let invaliduId = 0;
let invalidDm = -1;
let dm;
let start;

beforeEach(() => {
  requestClear();
  user = requestAuthRegister('test@gmail.com', 'password', 'firstname', 'lastname');
  user1 = requestAuthRegister('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  user2 = requestAuthRegister('test2@gmail.com', 'password2', 'firstname2', 'lastname2');
  dm = requestDmCreate(user.token, [user1.authUserId]);
  start = 0;
  if (user.token === invalidToken || user1.token === invalidToken || user2.token === invalidToken) {
    invalidToken = 'invalid1';
  }
  if (user.token === invalidToken || user1.token === invalidToken || user2.token === invalidToken) {
    invalidToken = 'invalid2';
  }
  while (user.authUserId === invaliduId || user1.authUserId === invaliduId || user2.authUserId === invaliduId) {
    invaliduId++;
  }
});

// =========================================================================
// DM Create Tests
describe('/dm/create/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid uId', () => {
      expect(requestDmCreate(user.token, [invaliduId])).toStrictEqual(ERROR);
    });

    test('Test 2: Duplicate uIds', () => {
      let uIds = [user1.authUserId, user1.authUserId];
      expect(requestDmCreate(user.token, uIds)).toStrictEqual(ERROR);
    });

    test('Test 3: Invalid token', () => {
      expect(requestDmCreate(invalidToken, [user1.authUserId])).toStrictEqual(ERROR);
    });

    test('Test 4: owner in uIds', () => {
      let uIds = [user.authUserId, user1.authUserId];
      expect(requestDmCreate(user.token, [user.authUserId])).toStrictEqual(ERROR);
      expect(requestDmCreate(user.token, uIds)).toStrictEqual(ERROR);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestDmCreate(user.token, [user1.authUserId])).toStrictEqual({ dmId: expect.any(Number) });
    expect(requestDmCreate(user.token, [])).toStrictEqual({ dmId: expect.any(Number) });
  });
});

// =========================================================================
// DM List Tests
describe('/dm/list/v1', () => {
  test('Test 1: Invalid token', () => {
    expect(requestDmList(invalidToken)).toStrictEqual(ERROR);
  });

  test('Test 2: Successful case', () => {
    expect(requestDmList(user.token)).toStrictEqual(
      { 
        dms:
        [
          {
            dmId: dm.dmId,
            name: 'firstnamelastname, firstname1lastname1'
          }
        ]
      }
    );
  });
});

// =========================================================================
// DM Remove Tests
describe('/dm/remove/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid token', () => {
      expect(requestDmRemove(invalidToken, dm.dmId)).toStrictEqual(ERROR);
    });

    test('Test 2: Invalid dmId', () => {
      expect(requestDmRemove(user.token, invalidDm)).toStrictEqual(ERROR);
    });

    test('Test 3: User is not DM creator', () => {
      expect(requestDmRemove(user1.token, dm.dmId)).toStrictEqual(ERROR);
    });

    test('Test 4: User is no longer in dm', () => {
      requestDmLeave(user.token, dm.dmId);
      expect(requestDmRemove(user.token, invalidDm)).toStrictEqual(ERROR);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestDmRemove(user.token, dm.dmId)).toStrictEqual({})
  });
});

// =========================================================================
// DM Details Tests
describe('/dm/details/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid token', () => {
      expect(requestDmDetails(invalidToken, dm.dmId)).toStrictEqual(ERROR);
    });

    test('Test 2: Invalid dmId', () => {
      expect(requestDmDetails(user.token, invalidDm)).toStrictEqual(ERROR);
    });

    test('Test 3: User is not a member of the DM', () => {
      expect(requestDmDetails(user2.token, dm.dmId)).toStrictEqual(ERROR);
    });
  });

  test('Test 1: Successful case - 2 members in the DM', () => {
    expect(requestDmDetails(user.token, dm.dmId)).toStrictEqual(
      {
        name: 'firstnamelastname, firstname1lastname1',
        members:
        [
          {
            uId: user.authUserId,
            email: 'test@gmail.com',
            nameFirst: 'firstname',
            nameLast: 'lastname',
            handleStr: 'firstnamelastname'
          },
          {
            uId: user1.authUserId,
            email: 'test1@gmail.com',
            nameFirst: 'firstname1',
            nameLast: 'lastname1',
            handleStr: 'firstname1lastname1'
          }
        ]
      }
    );
  });

  test('Test 2: Successful case - 3 members in the DM', () => {
    let dm1 = requestDmCreate(user.token, [user1.authUserId, user2.authUserId]);
    expect(requestDmDetails(user.token, dm1.dmId)).toStrictEqual(
      {
        name: 'firstnamelastname, firstname1lastname1, firstname2lastname2',
        members:
        [
          {
            uId: user.authUserId,
            email: 'test@gmail.com',
            nameFirst: 'firstname',
            nameLast: 'lastname',
            handleStr: 'firstnamelastname'
          },
          {
            uId: user1.authUserId,
            email: 'test1@gmail.com',
            nameFirst: 'firstname1',
            nameLast: 'lastname1',
            handleStr: 'firstname1lastname1'
          },
          {
            uId: user2.authUserId,
            email: 'test2@gmail.com',
            nameFirst: 'firstname2',
            nameLast: 'lastname2',
            handleStr: 'firstname2lastname2'
          }
        ]
      }
    );
  });

});

// =========================================================================
// DM Leave Tests
describe('/dm/leave/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid token', () => {
      expect(requestDmLeave(invalidToken, dm.dmId)).toStrictEqual(ERROR);
    });

    test('Test 2: Invalid dmId', () => {
      expect(requestDmLeave(user.token, invalidDm)).toStrictEqual(ERROR);
    });

    test('Test 3: User is not a member of the DM', () => {
      expect(requestDmLeave(user2.token, dm.dmId)).toStrictEqual(ERROR);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestDmLeave(user.token, dm.dmId)).toStrictEqual({});
  });

});

// =========================================================================
// DM Messages Tests
describe('/dm/messages/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid dmId', () => {
      expect(requestDmMessages(user.token, invalidDm, start)).toStrictEqual(ERROR);
    });

    test('Test 2: Invalid token', () => {
      expect(requestDmMessages(invalidToken, dm.dmId, start)).toStrictEqual(ERROR);
    });

    test('Test 3: Start is greater than num of messages', () => {
      start = 1;
      expect(requestDmMessages(user.token, dm.dmId, start)).toStrictEqual(ERROR);
    });

    test('Test 4: User is not in dm', () => {
      expect(requestDmMessages(user2.token, dm.dmId, start)).toStrictEqual(ERROR);
    });
  });

  test('Test 1: No messages in dm', () => {
    expect(requestDmMessages(user.token, dm.dmId, start)).toStrictEqual(
      {
        messages: [],
        start: 0,
        end: -1,
      }
    );
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
      let emptyString: string = '';
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
      expect(requestMessageSendDm(user2.token, dm.dmId, message)).toStrictEqual(ERROR);
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
