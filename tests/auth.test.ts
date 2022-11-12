import {
  requestClear,
  requestAuthRegister,
  requestAuthLogin,
  requestAuthLogout
} from './helper';

// const ERROR = { error: expect.any(String) };

beforeEach(() => {
  requestClear();
});

// =========================================================================
// Auth Login Tests
describe('/auth/login/v2', () => {
  describe('Error', () => {
    test('Test 1: Email doesnt belong to a user', () => {
      expect(requestAuthRegister('Validemail@gmail.com', 'password', 'Lebron', 'James')).toStrictEqual({
        token: expect.any(String),
        authUserId: expect.any(Number)
      });
      expect(requestAuthLogin('Wrongemail@gmail.com', 'password')).toStrictEqual(400);
    });

    test('Test 2: Incorrect password is entered', () => {
      expect(requestAuthRegister('Validemail@gmail.com', 'password', 'Lebron', 'James')).toStrictEqual({
        token: expect.any(String),
        authUserId: expect.any(Number)
      });
      expect(requestAuthLogin('Validemail@gmail.com', 'wrongPassword')).toStrictEqual(400);
    });
  });

  test('Test 1: Successful case 1', () => {
    expect(requestAuthRegister('Validemail@gmail.com', 'password', 'Lebron', 'James')).toStrictEqual({
      token: expect.any(String),
      authUserId: expect.any(Number)
    });
    expect(requestAuthLogin('Validemail@gmail.com', 'password')).toStrictEqual({
      token: expect.any(String),
      authUserId: expect.any(Number)
    });
  });

  test('Test 2: Successful case 2', () => {
    expect(requestAuthRegister('Validemail@gmail.com', 'password', 'Lebron', 'James')).toStrictEqual({
      token: expect.any(String),
      authUserId: expect.any(Number)
    });
    expect(requestAuthLogin('Validemail@gmail.com', 'password')).toStrictEqual({
      token: expect.any(String),
      authUserId: expect.any(Number)
    });
    expect(requestAuthRegister('second@gmail.com', 'sdjnasdnjkasnjdnj', 'Lebron', 'James')).toStrictEqual({
      token: expect.any(String),
      authUserId: expect.any(Number)
    });
    expect(requestAuthLogin('second@gmail.com', 'sdjnasdnjkasnjdnj')).toStrictEqual({
      token: expect.any(String),
      authUserId: expect.any(Number)
    });
  });
});

// =========================================================================
// Auth Register Tests
describe('/auth/register/v1', () => {
  describe('Error', () => {
    test('Test 1: Invalid email', () => {
      expect(requestAuthRegister('Invalidemail@@gmail.com', 'password', 'Rachit', 'Raturi')).toStrictEqual(400);
    });

    test('Test 2: Email address already in use', () => {
      expect(requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella')).toStrictEqual({
        token: expect.any(String),
        authUserId: expect.any(Number)
      });
      expect(requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella')).toStrictEqual(400);
    });

    test('Test 3: Password is not strong enough', () => {
      expect(requestAuthRegister('weakpassword@gmail.com', 'weak', 'Jackson', 'Smith')).toStrictEqual(400);
    });

    test('Test 4: Empty password', () => {
      expect(requestAuthRegister('nopassword@gmail.com', '', 'David', 'Jones')).toStrictEqual(400);
    });

    test('Test 5: Invalid first name', () => {
      expect(requestAuthRegister('nofirst@gmail.com', 'pastword',
        'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz', 'Jameson')).toStrictEqual(400);
    });

    test('Test 6: Invalid second name', () => {
      expect(requestAuthRegister('nolast@gmail.com', 'pastwords', 'colin',
        'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabc')).toStrictEqual(400);
    });
  });

  test('Test 1: Successful case', () => {
    expect(requestAuthRegister('validemail@gmail.com', 'password', 'first', 'last')).toStrictEqual({
      token: expect.any(String),
      authUserId: expect.any(Number)
    });
    expect(requestAuthRegister('validemail1@gmail.com', 'password1', 'first', 'last')).toStrictEqual({
      token: expect.any(String),
      authUserId: expect.any(Number)
    });
  });
});

// =========================================================================
// Auth Logout Tests
describe('/auth/logout/v1', () => {
  test('Test 1: Invalid token', () => {
    const userNew = requestAuthRegister('validemail@gmail.com', 'password', 'first', 'last');
    expect(userNew).toStrictEqual({
      token: expect.any(String),
      authUserId: expect.any(Number)
    });
    expect(requestAuthLogout('0')).toStrictEqual(403);
  });

  test('Test 2: Successful case', () => {
    const userNew = requestAuthRegister('validemail@gmail.com', 'password', 'first', 'last');
    expect(userNew).toStrictEqual({
      token: expect.any(String),
      authUserId: expect.any(Number)
    });
    expect(requestAuthLogout(userNew.token)).toStrictEqual({});
  });
});
