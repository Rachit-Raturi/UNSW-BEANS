import { authLoginV1, authRegisterV1, authLogoutV1 } from '..src/auth';

import request, { HttpVerb } from 'sync-request';

import { port, url } from '../src/config.json';

const SERVER_URL = `${url}:${port}`;
const ERROR = { error: expect.any(String) };

function requestHelper(method: HttpVerb, path: string, payload: object) {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  const res = request(method, SERVER_URL + path, { qs, json });
  return JSON.parse(res.getBody('utf-8'));
}

// wrapper functions

function requestAuthLoginV1(email: string, password: string) {
    return requestHelper('POST', '/auth/login/v2', { email, password });
}

function requestAuthRegisterV1(email: string, password: string, nameFirst: string, nameLast: string) {
    return requestHelper('POST', '/auth/register/v2', { email, password, nameFirst, nameLast });
}

function requestAuthLogoutV1(token: string) {
    return requestHelper('POST', '/auth/logout/V1', { token });
}

function requestClearV1() {
    return requestHelper('DELETE', '/clear', {});
}

beforeEach(() => {
    requestClearV1();
});

describe('tests for /auth/login/v2', () => {
    test('Test 1: Email doesnt belong to a user', () => {
        expect(requestAuthRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James'))
          .toStrictEqual({ 
            token: expect.any(string),
            authUserId: expect.any(Number) });
        expect(requestAuthLoginV1('Wrongemail@gmail.com', 'password'))
          .toStrictEqual({ error: expect.any(String) });
      });
    
      test('Test 2: Incorrect password is entered', () => {
        expect(requestAuthRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James'))
          .toStrictEqual({ 
            token: expect.any(string),
            authUserId: expect.any(Number) });
        expect(requestAuthLoginV1('Validemail@gmail.com', 'wrongPassword'))
          .toStrictEqual({ error: expect.any(String) });
      });
    
      test('Test 3: Successful login test 1', () => {
        expect(requestAuthRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James'))
          .toStrictEqual({ 
            token: expect.any(string),
            authUserId: expect.any(Number) });
        expect(requestAuthLoginV1('Validemail@gmail.com', 'password'))
          .toStrictEqual({ 
            token: expect.any(string),
            authUserId: expect.any(Number) });
      });
    
      test('Test 4: Successful login test 2', () => {
        expect(requestAuthRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James'))
          .toStrictEqual({ 
            token: expect.any(string),
            authUserId: expect.any(Number) });
        expect(requestAuthLoginV1('Validemail@gmail.com', 'password'))
          .toStrictEqual({ 
            token: expect.any(string),
            authUserId: expect.any(Number) });
        expect(requestAuthRegisterV1('second@gmail.com', 'sdjnasdnjkasnjdnj', 'Lebron', 'James'))
          .toStrictEqual({ 
            token: expect.any(string),
            authUserId: expect.any(Number) });
        expect(requestAuthLoginV1('second@gmail.com', 'sdjnasdnjkasnjdnj'))
          .toStrictEqual({ 
            token: expect.any(string),
            authUserId: expect.any(Number) });
      });
});

describe('Tests for /auth/register/v1', () => {
    test('Test 1: Invalid email', () => {
      expect(requestAuthRegisterV1('Invalidemail@@gmail.com', 'password',
        'Rachit', 'Raturi'))
        .toStrictEqual({ error: expect.any(String) });
    });
  
    test('Test 2: Email address already in use', () => {
      expect(requestAuthRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella'))
        .toStrictEqual({ 
            token: expect.any(string),
            authUserId: expect.any(Number) });
      expect(requestAuthRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella'))
        .toStrictEqual({ error: expect.any(String) });
    });
  
    test('Test 3: Password is not strong enough', () => {
      expect(requestAuthRegisterV1('weakpassword@gmail.com', 'weak', 'Jackson', 'Smith'))
        .toStrictEqual({ error: expect.any(String) });
    });
  
    test('Test 4: Empty password', () => {
      expect(requestAuthRegisterV1('nopassword@gmail.com', '', 'David', 'Jones'))
        .toStrictEqual({ error: expect.any(String) });
    });
  
    test('Test 5: First name isnt valid', () => {
      expect(requestAuthRegisterV1('nofirst@gmail.com', 'pastword',
        'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz', 'Jameson'))
        .toStrictEqual({ error: expect.any(String) });
    });
  
    test('Test 6: Second name isnt valid', () => {
      expect(requestAuthRegisterV1('nolast@gmail.com', 'pastwords', 'colin',
        'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabc'))
        .toStrictEqual({ error: expect.any(String) });
    });
  
    test('Test 7: Successful use of authRegisterV1', () => {
      expect(requestAuthRegisterV1('validemail@gmail.com', 'password', 'first', 'last'))
        .toStrictEqual({ 
            token: expect.any(string),
            authUserId: expect.any(Number) });
      expect(requestAuthRegisterV1('validemail1@gmail.com', 'password1', 'first', 'last'))
        .toStrictEqual({ 
            token: expect.any(string),
            authUserId: expect.any(Number) });
    });
  });

describe('Tests for /auth/logout/v1', () => {
    test('Test 1: invalid token entered ', () => {
        expect(requestAuthRegisterV1('validemail@gmail.com', 'password', 'first', 'last'))
        .toStrictEqual({ 
            token: expect.any(string),
            authUserId: expect.any(Number) });
        expect(requestAuthLogoutV1('0')).toStrictEqual({ error: expect.any(String) });
    });

    test('Test 2: valid token entered', () => {
      const user = requestAuthRegisterV1('validemail@gmail.com', 'password', 'first', 'last');
      expect(user)
      .toStrictEqual({ 
        token: expect.any(string),
        authUserID: expect.any(Number)});
    });

    expect(requestAuthLogoutV1(user.token))
    .toStrictEqual({});
});