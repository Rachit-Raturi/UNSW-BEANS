import {
  requestClear,
  requestAdminUserRemove,
  requestAdminUserPermissionChange,
  requestAuthRegister
} from './helper';

// const ERROR = { error: expect.any(String) };

beforeEach(() => {
  requestClear();
});

describe('AdminUserRemove tests', () => {
  test('Test 1: invalid token', () => {
    const user = requestAuthRegister('valid@gmail.com', 'password', 'valid', 'valid');
    const user1 = requestAuthRegister('valid1@gmail.com', 'password1', 'validd', 'validd');
    expect(requestAdminUserRemove(user1.authUserId, user.token + '0')).toStrictEqual(403);
  });

  test('Test 2: not authorised', () => {
    const user = requestAuthRegister('valid@gmail.com', 'password', 'valid', 'valid');
    const user1 = requestAuthRegister('valid1@gmail.com', 'password1', 'validd', 'validd');
    expect(requestAdminUserRemove(user.authUserId, user1.token)).toStrictEqual(403);
  });

  test('Test 3: invalid uId', () => {
    const user = requestAuthRegister('valid@gmail.com', 'password', 'valid', 'valid');
    const user1 = requestAuthRegister('valid1@gmail.com', 'password1', 'validd', 'validd');
    let incorrectId = 1;
    if (user1.authUserId === 1) {
      incorrectId = 2;
    }
    expect(requestAdminUserRemove(incorrectId, user.token)).toStrictEqual(400);
  });

  test('Test 4: uId refers to only global owner', () => {
    const user = requestAuthRegister('valid@gmail.com', 'password', 'valid', 'valid');
    expect(requestAdminUserRemove(user.authUserId, user.token)).toStrictEqual(400);
  });

  test('Test 5: success', () => {
    const user = requestAuthRegister('valid@gmail.com', 'password', 'valid', 'valid');
    const user1 = requestAuthRegister('valid1@gmail.com', 'password1', 'validd', 'validd');
    expect(requestAdminUserRemove(user1.authUserId, user.token)).toStrictEqual({});
  });
});

describe('AdminUserPermissionChange tests', () => {
  test('Test 1: invalid token', () => {
    const user = requestAuthRegister('valid@gmail.com', 'password', 'valid', 'valid');
    const user1 = requestAuthRegister('valid1@gmail.com', 'password1', 'validd', 'validd');
    expect(requestAdminUserPermissionChange(user1.authUserId, 1, user.token + '0')).toStrictEqual(403);
  });

  test('Test 2: not authorised', () => {
    const user = requestAuthRegister('valid@gmail.com', 'password', 'valid', 'valid');
    const user1 = requestAuthRegister('valid1@gmail.com', 'password1', 'validd', 'validd');
    expect(requestAdminUserPermissionChange(user.authUserId, 1, user1.token)).toStrictEqual(403);
  });

  test('Test 3: invalid uId', () => {
    const user = requestAuthRegister('valid@gmail.com', 'password', 'valid', 'valid');
    const user1 = requestAuthRegister('valid1@gmail.com', 'password1', 'validd', 'validd');
    let incorrectId = 1;
    if (user1.authUserId === 1) {
      incorrectId = 2;
    }
    expect(requestAdminUserPermissionChange(incorrectId, 1, user.token)).toStrictEqual(400);
  });

  test('Test 4: uId refers to only global owner', () => {
    const user = requestAuthRegister('valid@gmail.com', 'password', 'valid', 'valid');
    const user1 = requestAuthRegister('valid1@gmail.com', 'password1', 'validd', 'validd');
    expect(requestAdminUserPermissionChange(user1.authUserId, 3, user.token)).toStrictEqual(400);
  });

  test('Test 5: success', () => {
    const user = requestAuthRegister('valid@gmail.com', 'password', 'valid', 'valid');
    const user1 = requestAuthRegister('valid1@gmail.com', 'password1', 'validd', 'validd');
    expect(requestAdminUserPermissionChange(user1.authUserId, 1, user.token)).toStrictEqual({});
    expect(requestAdminUserRemove(user.authUserId, user1.token)).toStrictEqual({});
  });
});
