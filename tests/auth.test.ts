
import { authLoginV1, authRegisterV1 } from '../src/auth';
import { clearV1 } from '../src/other';

beforeEach(() => {
  clearV1();
});

describe('Tests for authLoginV1', () => {
  test('Test 1: Email doesnt belong to a user', () => {
    expect(authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James'))
      .toStrictEqual({ authUserId: expect.any(Number) });
    expect(authLoginV1('Wrongemail@gmail.com', 'password'))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 2: Incorrect password is entered', () => {
    expect(authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James'))
      .toStrictEqual({ authUserId: expect.any(Number) });
    expect(authLoginV1('Validemail@gmail.com', 'wrongPassword'))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 3: Successful login test 1', () => {
    expect(authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James'))
      .toStrictEqual({ authUserId: expect.any(Number) });
    expect(authLoginV1('Validemail@gmail.com', 'password'))
      .toStrictEqual({ authUserId: expect.any(Number) });
  });

  test('Test 4: Successful login test 2', () => {
    expect(authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James'))
      .toStrictEqual({ authUserId: expect.any(Number) });
    expect(authLoginV1('Validemail@gmail.com', 'password'))
      .toStrictEqual({ authUserId: expect.any(Number) });
    expect(authRegisterV1('second@gmail.com', 'sdjnasdnjkasnjdnj', 'Lebron', 'James'))
      .toStrictEqual({ authUserId: expect.any(Number) });
    expect(authLoginV1('second@gmail.com', 'sdjnasdnjkasnjdnj'))
      .toStrictEqual({ authUserId: expect.any(Number) });
  });
});

describe('Tests for authRegisterV1', () => {
  test('Test 1: Invalid email', () => {
    expect(authRegisterV1('Invalidemail@@gmail.com', 'password',
      'Rachit', 'Raturi'))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 2: Email address already in use', () => {
    expect(authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella'))
      .toStrictEqual({ authUserId: expect.any(Number) });
    expect(authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella'))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 3: Password is not strong enough', () => {
    expect(authRegisterV1('weakpassword@gmail.com', 'weak', 'Jackson', 'Smith'))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 4: Empty password', () => {
    expect(authRegisterV1('nopassword@gmail.com', '', 'David', 'Jones'))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 5: First name isnt valid', () => {
    expect(authRegisterV1('nofirst@gmail.com', 'pastword',
      'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz', 'Jameson'))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 6: Second name isnt valid', () => {
    expect(authRegisterV1('nolast@gmail.com', 'pastwords', 'colin',
      'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabc'))
      .toStrictEqual({ error: expect.any(String) });
  });

  test('Test 7: Successful use of authRegisterV1', () => {
    expect(authRegisterV1('validemail@gmail.com', 'password', 'first', 'last'))
      .toStrictEqual({ authUserId: expect.any(Number) });
    expect(authRegisterV1('validemail1@gmail.com', 'password1', 'first', 'last'))
      .toStrictEqual({ authUserId: expect.any(Number) });
  });
});
