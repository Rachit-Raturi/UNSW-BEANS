import {
  requestClear,
  requestAuthRegister,
  requestUserProfile,
  requestUsersAll,
  requestUserSetName,
  requestUserSetEmail,
  requestUserSetHandle
} from './helper';

const ERROR = { error: expect.any(String) };

let user;
let invalidToken = 'invalid';
let invalidId = 0;

beforeEach(() => {
  requestClear();
  user = requestAuthRegister('test@gmail.com', 'password', 'firstname', 'lastname');

  if (user.token === invalidToken) {
    invalidToken = 'invalid1';
  }
  if (user.authUserId === invalidId) {
    invalidId = 1;
  }
});

// =========================================================================
// User Profile Tests
describe('/user/profile/v2', () => {
  describe('Error', () => {
    test('Test 1: Invalid token', () => {
      expect(requestUserProfile(invalidToken, user.authUserId)).toStrictEqual(ERROR);
    });

    test('Test 2: Invalid uId', () => {
      expect(requestUserProfile(user.token, invalidId)).toStrictEqual(ERROR);
    });
  });

  test('Test 1: Successful case - view another user', () => {
    let user1 = requestAuthRegister('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
    expect(requestUserProfile(user.token, user1.authUserId)).toStrictEqual(
      {
        user: {
          uId: user1.authUserId,
          email: 'test1@gmail.com',
          nameFirst: 'firstname1',
          nameLast: 'lastname1',
          handleStr: 'firstname1lastname1',
        }
      }
    );
  });
});

// =========================================================================
// Users All Tests
describe('/users/all/v1', () => {
  test('Error Test 1: Invalid token', () => {
    expect(requestUsersAll(invalidToken)).toStrictEqual(ERROR);
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
      }
    )
    outputarray.push(
      {
        uId: user1.authUserId,
        email: 'test2@gmail.com',
        nameFirst: 'firstname1',
        nameLast: 'lastname1',
        handleStr: 'firstname1lastname1',
      }
    )

    const outputSet = new Set(outputarray);
    const inputSet = new Set(requestUsersAll(user.token).users);

    expect(inputSet).toStrictEqual(outputSet);
  });
});

// =========================================================================
// User Set Name Tests
describe('/user/profile/setname/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid nameFirst length', () => {
      expect(requestUserSetName(user.token, '', 'apples')).toStrictEqual(ERROR);
      expect(requestUserSetName(user.token, 'abcdefgHiAjSjoWjoDAWojdsodasdjodaowapdoapcdwocwapdaowdj', 'apples')).toStrictEqual(ERROR);
    });

    test('Test 2: Invalid nameLast length', () => {
      expect(requestUserSetName(user.token, 'apples', '')).toStrictEqual(ERROR);
      expect(requestUserSetName(user.token, 'apples', 'abcdefgHiAjSjoWjoDAWojdsodasdjodaowapdoapcdwocwapdaowdj')).toStrictEqual(ERROR);
    });

    test('Test 3: Invalid token', () => {
      expect(requestUserSetName(invalidToken, 'apples', 'oranges')).toStrictEqual(ERROR);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestUserSetName(user.token, 'apples', 'oranges')).toStrictEqual({});
  });
});

// =========================================================================
// User Set Email Tests
describe('/user/profile/setemail/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid email', () => {
      expect(requestUserSetEmail(user.token, 'invalidemail')).toStrictEqual(ERROR);
    });

    test('Test 2: Same email entered', () => {
      expect(requestUserSetEmail(user.token, 'test@gmail.com')).toStrictEqual(ERROR);
    });

    test('Test 3: Email used by another user', () => {
      requestAuthRegister('test2@gmail.com', 'password2', 'firstname1', 'lastname1');
      expect(requestUserSetEmail(user.token, 'test2@gmail.com')).toStrictEqual(ERROR);
    });

    test('Test 4: Invalid token', () => {
      expect(requestUserSetEmail(invalidToken, 'test@gmail.com')).toStrictEqual(ERROR);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestUserSetEmail(user.token, 'test999@gmail.com')).toStrictEqual({});
  });
});

// =========================================================================
// User Set Handle Tests
describe('/user/profile/sethandle/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid handleStr length', () => {
      expect(requestUserSetHandle(user.token, 'overtwentycharactersincl')).toStrictEqual(ERROR);
      expect(requestUserSetHandle(user.token, 'be')).toStrictEqual(ERROR);
    });

    test('Test 2: Same handleStr', () => {
      expect(requestUserSetHandle(user.token, 'firstnamelastname')).toStrictEqual(ERROR);
    });

    test('Test 3: handleStr already used', () => {
      requestAuthRegister('test2@gmail.com', 'password2', 'firstname1', 'lastname1');
      expect(requestUserSetHandle(user.token, 'firstname1lastname1')).toStrictEqual(ERROR);
    });

    test('Test 4: Invalid characters', () => {
      expect(requestUserSetHandle(user.token, '%invalid_handle$')).toStrictEqual(ERROR);
    });

    test('Test 5: Invalid token', () => {
      expect(requestUserSetHandle(invalidToken, 'firstname1lastname1')).toStrictEqual(ERROR);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestUserSetHandle(user.token, 'givemeyourstring1')).toStrictEqual({});
  });
});