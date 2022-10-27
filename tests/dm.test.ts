import {
  requestClear,
  requestAuthRegister,
  requestDmCreate,
  requestDmList,
  requestDmRemove,
  requestDmDetails,
  requestDmLeave,
  requestDmMessages
} from './helper';

const ERROR = { error: expect.any(String) };

let user;
let user1;
let user2;
let invalidToken = 'invalid';
let invalidDm = -1;
let dm;
let start;

beforeEach(() => {
  requestClear();
  user = requestAuthRegister('test@gmail.com', 'password', 'firstname', 'lastname');
  if (user.token === invalidToken) {
    invalidToken = 'invalid1';
  }
  if (user.token === invalidToken) {
    invalidToken = 'invalid2';
  }
});
 
// =========================================================================
// DM Create Tests
describe('dm/create/v1', () => {
  test('Test 1: There is a uId that does not refer to valid user', () => {
    expect(requestDmCreate(user.token, user1.uId + 1)).toStrictEqual(ERROR);
  });

  test('Test 2: Duplicate uIds', () => {
    let uIds = [user.authUserId, user,authUserId];
    expect(requestDmCreate(user.token, uIds)).toStrictEqual(ERROR);
  });

  test('Test 3: Invalid token', () => {
    expect(requestDmCreate(invalidToken, user.authUserId)).toStrictEqual(ERROR);
  });

  test('Test 4: Successful dm created', () => {
    expect(requestDmCreate(user.token, user1.authUserId)).toStrictEqual(expect.any(Number));
  });
});



beforeEach(() => {
  requestClear();
  user = requestAuthRegister('test@gmail.com', 'password', 'firstname', 'lastname');
  user1 = requestAuthRegister('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  user2 = requestAuthRegister('email2@gmail.com', 'password2', 'firstname2', 'lastname2');
  dm = requestDmCreate(user.token, user1.uId);
  start = 0;
  if (user.token === invalidToken || user1.token === invalidToken || user2.token === invalidToken) {
    invalidToken = 'invalid1';
  }
  if (user.token === invalidToken || user1.token === invalidToken || user2.token === invalidToken) {
    invalidToken = 'invalid2';
  }
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
            name: dm.name
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

  test('Test 1: Successful case', () => {
    expect(requestDmDetails(user.token, dm.dmId)).toStrictEqual(
      {
        name: dm.name,
        members: dm.members
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
      expect(requestDmMessages(user1.token, dm.dmId, start)).toStrictEqual(ERROR);
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
