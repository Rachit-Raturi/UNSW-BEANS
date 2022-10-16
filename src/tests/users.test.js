import { authRegisterV1 } from '../auth.js';
import { userProfileV1 } from '../users.js';
import { clearV1 } from '../other.js';

let user;
let invalidId = 1;

beforeEach(() => {
  clearV1();
  user = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
  if (user.authUserId === 1) {
    invalidId = 2;
  }
});

describe('error tests for UserProfileV1', () => {
  test('test 1: invalid authuserid', () => {
    expect(userProfileV1(invalidId, user.authUserId))
      .toStrictEqual({ error: expect.any(String) });
  });
  test('test 2: invalid uId', () => {
    expect(userProfileV1(user.authUserId, invalidId))
      .toStrictEqual({ error: expect.any(String) });
  });
});

describe('valid test for UserProfileV1', () => {
  test('test 1: valid authuserid', () => {
    const user1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1',
      'lastname1');
    expect(userProfileV1(user.authUserId, user1.authUserId)).toStrictEqual(
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
