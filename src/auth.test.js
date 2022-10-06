import { authLoginV1, authRegisterV1 } from './auth';
import { getData, setData } from './dataStore';
import ClearV1 from './other';

beforeEach(() => {
  ClearV1();
});

describe('Tests for authLoginV1', () => {
  test('Test 1: email doesnt belong to a user', () => {
    let loginTest = authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James');
    expect(authLoginV1('Wrongemail@gmail.com', 'password')).toEqual({error: expect.any(String)});
  });

  test('Test 2: incorrect password is entered', () => {
    let loginTest = authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James');
    expect(authLoginV1('Validemail@gmail.com', 'wrongPassword')).toEqual({error: expect.any(String)});
  });

  test('Test 3: successful login test 1', () => {
    let loginTest = authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James');
    expect(authLoginV1('Validemail@gmail.com', 'password')).toEqual({authUserId: expect.any(Number)});
  });

  test('Test 4: successful login test 2', () => {
    let loginTest = authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James');
    expect(authLoginV1('Validemail@gmail.com', 'password')).toEqual({authUserId: expect.any(Number)});
    let loginTest2 = authRegisterV1('second@gmail.com', 'sdjnasdnjkasnjdnj', 'Lebron', 'James');
    expect(authLoginV1('second@gmail.com', 'sdjnasdnjkasnjdnj')).toEqual({authUserId: expect.any(Number)});
  });
});



describe('Tests for authRegisterV1', () => {
  test('Test 1: invalid email', () => {
    expect(authRegisterV1('Invalidemail@@gmail.com', 'password', 'Rachit', 'Raturi')).toEqual({error: expect.any(String)});
  });

  test ('Test 2: email address already in use', () => {
    let result = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella')).toEqual({error: expect.any(String)});
  });

  test('Test 3: password is not strong enough', () => {
    expect(authRegisterV1('weakpassword@gmail.com', 'weak', 'Jackson', 'Smith')).toEqual({error: expect.any(String)});
  });

  test('Test 4: empty password', () => {
    expect(authRegisterV1('nopassword@gmail.com', '', 'David', 'Jones')).toEqual({error: expect.any(String)});
  });

  test('Test 5: first name isnt valid', () => {
    expect(authRegisterV1('nofirst@gmail.com', 'pastword', 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz',
                          'Jameson')).toEqual({error: expect.any(String)});
  });

  test('Test 6: second name isnt valid', () => {
    expect(authRegisterV1('nolast@gmail.com', 'pastwords', 'colin',
                          'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabc')).toEqual({error: expect.any(String)});
  });

  test('Test 7: succesful use of authRegisterV1', () => {
    expect(authRegisterV1('validemail@gmail.com', 'password', 'first', 'last')).toEqual({authUserId: expect.any(Number)});
    expect(authRegisterV1('validemail1@gmail.com', 'password1', 'first', 'last')).toEqual({authUserId: expect.any(Number)});
    expect(authRegisterV1('validemail2@gmail.com', 'password2', 'first', 'last')).toEqual({authUserId: expect.any(Number)});
  });
});