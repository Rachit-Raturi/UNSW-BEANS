import { authRegisterV1, authLoginV1 } from './auth';
import { getData, setData } from './dataStore';
import ClearV1 from './other';


describe('tests for the authRegisterV1 function', () => {
  test('test 1: invalid email', () => {
    ClearV1();
    expect(authRegisterV1('Invalidemail@@gmail.com', 'password', 'Rachit', 'Raturi')).toEqual({error: expect.any(String)});
  });

  test ('test 2: email address already in use', () => {
    ClearV1();
    let result = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella')).toEqual({error: expect.any(String)});
  });

  test('test 3: password is not strong enough', () => {
    ClearV1();
    expect(authRegisterV1('weakpassword@gmail.com', 'weak', 'Jackson', 'Smith')).toEqual({error: expect.any(String)});
  });

  test('test 4: empty password', () => {
    ClearV1();
    expect(authRegisterV1('nopassword@gmail.com', '', 'David', 'Jones')).toEqual({error: expect.any(String)});
  });

  test('test 5: first name isnt valid', () => {
    ClearV1();
    expect(authRegisterV1('nofirst@gmail.com', 'pastword', 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz',
                          'Jameson')).toEqual({error: expect.any(String)});
  });

  test('test 6: second name isnt valid', () => {
    ClearV1();
    expect(authRegisterV1('nolast@gmail.com', 'pastwords', 'colin',
                          'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabc')).toEqual({error: expect.any(String)});
  });

  test('test 7: succesful use of authRegisterV1', () => {
    ClearV1();
    expect(authRegisterV1('validemail@gmail.com', 'password', 'first', 'last')).toEqual({authUserId: expect.any(Number)});
    expect(authRegisterV1('validemail1@gmail.com', 'password1', 'first', 'last')).toEqual({authUserId: expect.any(Number)});
    expect(authRegisterV1('validemail2@gmail.com', 'password2', 'first', 'last')).toEqual({authUserId: expect.any(Number)});
  });
});

describe('tests for the authLoginV1 function', () => {
  test('test 1: email doesnt belong to a user', () => {
    ClearV1();
    let loginTest = authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James');
    expect(authLoginV1('Wrongemail@gmail.com', 'password')).toEqual({error: expect.any(String)});
  });

  test('test 2: incorrect password is entered', () => {
    ClearV1();
    let loginTest = authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James');
    expect(authLoginV1('Validemail@gmail.com', 'wrongPassword')).toEqual({error: expect.any(String)});
  });

  test('test 3: successful login test 1', () => {
    ClearV1();
    let loginTest = authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James');
    expect(authLoginV1('Validemail@gmail.com', 'password')).toEqual({authUserId: expect.any(Number)});
  });

  test('test 4: successful login test 2', () => {
    ClearV1();
    let loginTest = authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James');
    expect(authLoginV1('Validemail@gmail.com', 'password')).toEqual({authUserId: expect.any(Number)});
    let loginTest2 = authRegisterV1('second@gmail.com', 'sdjnasdnjkasnjdnj', 'Lebron', 'James');
    expect(authLoginV1('second@gmail.com', 'sdjnasdnjkasnjdnj')).toEqual({authUserId: expect.any(Number)});
  });
});