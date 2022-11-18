import {
  requestClear,
  requestAdminUserRemove,
  requestAdminUserPermissionChange,
  requestAuthRegister,
  requestChannelsCreate,
  requestChannelJoin,
  requestMessageSendDm,
  requestMessageSend,
  requestDmCreate
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
    const channel = requestChannelsCreate(user.token, 'channel', true);
    requestChannelJoin(user1.token, channel.channelId);
    requestMessageSend(user.token, channel.channelId, 'message channel');
    requestMessageSend(user.token, channel.channelId, 'message1 channel');
    const dm = requestDmCreate(user.token, [user1.authUserId]);
    requestMessageSendDm(user1.token, dm.dmId, 'message dm');
    requestMessageSendDm(user.token, dm.dmId, 'message1 dm');
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

  test('Test 4: invalid permissionId', () => {
    const user = requestAuthRegister('valid@gmail.com', 'password', 'valid', 'valid');
    const user1 = requestAuthRegister('valid1@gmail.com', 'password1', 'validd', 'validd');
    expect(requestAdminUserPermissionChange(user1.authUserId, 3, user.token)).toStrictEqual(400);
  });

  test('Test 5: uId refers to only global owner', () => {
    const user = requestAuthRegister('valid@gmail.com', 'password', 'valid', 'valid');
    expect(requestAdminUserPermissionChange(user.authUserId, 2, user.token)).toStrictEqual(400);
  });

  test('Test 5: success', () => {
    const user = requestAuthRegister('valid@gmail.com', 'password', 'valid', 'valid');
    const user1 = requestAuthRegister('valid1@gmail.com', 'password1', 'validd', 'validd');
    expect(requestAdminUserPermissionChange(user1.authUserId, 1, user.token)).toStrictEqual({});
    expect(requestAdminUserRemove(user.authUserId, user1.token)).toStrictEqual({});
  });
});
