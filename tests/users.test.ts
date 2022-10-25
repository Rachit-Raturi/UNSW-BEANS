import {
  requestauthRegister,
  requestUserProfile,
  requestUsersAll,
  requestUserSetName,
  requestUserSetEmail,
  requestUserSetHandle,
  requestClear
} from './helper';

let user;
let invalidToken = 'invalid';
let invalidId = 0;
const ERROR = { error: expect.any(String) };

beforeEach(() => {
  requestClear();
  user = requestauthRegister('test@gmail.com', 'password', 'firstname', 'lastname');

  if (user.token === invalidToken) {
    invalidToken = 'invalid1';
  }
  if (user.authUserId === invalidId) {
    invalidId = 1;
  }
});

describe('Tests for user/profile/v2', () => {
  test('error test 1: invalid token', () => {
    expect(requestUserProfile(invalidToken, user.authUserId)).toStrictEqual(ERROR);
  });
  test('error test 2: invalid uId', () => {
    expect(requestUserProfile(user.token, invalidId)).toStrictEqual(ERROR);
  });
  test('valid test 1: view another user', () => {
    let user1 = requestauthRegister('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
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


describe('tests for user/profile/setemail/v1', () => {
  test('invalid email', () => {
    expect(requestUserSetEmail(user.token, 'invalidemail')).toStrictEqual(ERROR);
  });

  test('same email entered', () => {
    expect(requestUserSetEmail(user.token, 'test@gmail.com')).toStrictEqual(ERROR);
  });

  test('email used by another user', () => {
    requestauthRegister('test2@gmail.com', 'password2', 'firstname1', 'lastname1');
    expect(requestUserSetEmail(user.token, 'test2@gmail.com')).toStrictEqual(ERROR);
  });

  test('invalid token', () => {
    expect(requestUserSetEmail(invalidToken, 'test@gmail.com')).toStrictEqual(ERROR);
  });

  test('valid input', () => {
    expect(requestUserSetEmail(user.token, 'test999@gmail.com')).toStrictEqual({});
  });

});


describe('tests for user/profile/setname/v1', () => {
  test('invalid nameFirst length', () => {
    expect(requestUserSetName(user.token, '', 'apples')).toStrictEqual(ERROR);
    expect(requestUserSetName(user.token, 'abcdefgHiAjSjoWjoDAWojdsodasdjodaowapdoapcdwocwapdaowdj', 'apples')).toStrictEqual(ERROR);
  });

  test('invalid nameLast length', () => {
    expect(requestUserSetName(user.token, 'apples', '')).toStrictEqual(ERROR);
    expect(requestUserSetName(user.token, 'apples', 'abcdefgHiAjSjoWjoDAWojdsodasdjodaowapdoapcdwocwapdaowdj')).toStrictEqual(ERROR);
  });

  test('invalid token', () => {
    expect(requestUserSetName(invalidToken, 'apples', 'oranges')).toStrictEqual(ERROR);
  });

  test('valid input', () => {
    expect(requestUserSetName(user.token, 'apples', 'oranges')).toStrictEqual({});
  });

});


describe('tests for user/profile/sethandle/v1', () => {
  test('invalid handleStr length', () => {
    expect(requestUserSetHandle(user.token, 'overtwentycharactersincl')).toStrictEqual(ERROR);
    expect(requestUserSetHandle(user.token, 'be')).toStrictEqual(ERROR);
  });

  test('same handleStr', () => {
    expect(requestUserSetHandle(user.token, 'firstnamelastname')).toStrictEqual(ERROR);
  });

  test('handleStr already used', () => {
    requestauthRegister('test2@gmail.com', 'password2', 'firstname1', 'lastname1');
    expect(requestUserSetHandle(user.token, 'firstname1lastname1')).toStrictEqual(ERROR);
  });

  test('invalid characters', () => {
    expect(requestUserSetHandle(user.token, '%invalid_handle$')).toStrictEqual(ERROR);
  });

  test('invalid token', () => {
    expect(requestUserSetHandle(invalidToken, 'firstname1lastname1')).toStrictEqual(ERROR);
  });

  test('valid input', () => {
    expect(requestUserSetHandle(user.token, 'givemeyourstring1')).toStrictEqual({});
  });
});

describe('tests for users/all/v1', () => {
  test('invalid token', () => {
    expect(requestUsersAll(invalidToken)).toStrictEqual(ERROR);
  });

  test('valid input 1 user', () => {
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

  test('valid input multiple users', () => {
    const outputarray = [];
    const user1 = requestauthRegister('test2@gmail.com', 'password2', 'firstname1', 'lastname1');
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