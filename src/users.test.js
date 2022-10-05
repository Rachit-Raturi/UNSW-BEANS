import { authRegisterV1, authLoginV1 } from './auth.js';
import { userProfileV1 } from './users.js';
import ClearV1 from './other';

let user;
let invalid_id = 1;

beforeEach(() => {
  ClearV1();
  user = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
  if (user.authUserId === 1) {
    invalid_id === 2;
  }
});

describe('error tests for UserProfileV1', () => {
   

    test('test 1: invalid authuserid', () => {
      expect(userProfileV1(invalid_id, user.authUserId)).toStrictEqual({error: expect.any(String)});
    });
    test('test 2: invalid uId', () => {
      expect(userProfileV1(user.authUserId, invalid_id)).toStrictEqual({error: expect.any(String)});
    });
});

describe('valid test for UserProfileV1', () => {
  let user1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  test('test 1: invalid authuserid', () => {
    expect(userProfileV1(user.authUserId, user1.authUserId)).toStrictEqual(
      {
        uId: 1,
        email: 'test1@gmail.com',
        nameFirst: 'firstname1',
        nameLast: 'lastname1',
        handleStr: 'firstname1lastname1',
      });
  });
});
