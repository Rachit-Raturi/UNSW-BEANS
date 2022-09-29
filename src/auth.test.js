import { authRegisterV1, authLoginV1 } from './auth';
import { getData, setData } from './dataStore';
import ClearV1 from './other';


describe('tests for the authRegisterV1 function', () => {
  test('test 1: invalid email', () => {
    ClearV1();
    expect(authRegisterV1('Invalidemail@@gmail.com', 'password', 'Rachit', 'Raturi')).toEqual({error: 'Invalid email entered'});
  });

  test ('test 2: email address already in use', () => {
    ClearV1();
    let result = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella')).toEqual({error: 'Email is already in use'});
  });

  test('test 3: password is not strong enough', () => {
    ClearV1();
    expect(authRegisterV1('weakpassword@gmail.com', 'weak', 'Jackson', 'Smith')).toEqual({error: 'Password is less than 6 characters'});
  });

  test('test 4: empty password', () => {
    ClearV1();
    expect(authRegisterV1('nopassword@gmail.com', '', 'David', 'Jones')).toEqual({error: 'No password was entered'});
  });

  test('test 5: first name isnt valid', () => {
    ClearV1();
    expect(authRegisterV1('nofirst@gmail.com', 'pastword', 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz',
                          'Jameson')).toEqual({error: 'First name is not between 1 to 50 characters inclusive'});
  });

  test('test 6: second name isnt valid', () => {
    ClearV1();
    expect(authRegisterV1('nolast@gmail.com', 'pastwords', 'colin',
                          'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabc')).toEqual({error: 'Last name is not between 1 to 50 characters inclusive'});
  });

  test('test 7: user handle is concatenated', () => {
    ClearV1();
    let userHandleTest = authRegisterV1('concatenated@gmail.com', 'Concatenation', 'Khabib', 'Nurmagomedovshapirov');
    let data = getData();
    expect(data.users[0].userHandle.length).toEqual(20);
  });

  test('test 8: user handle is concatenated and then has numbers added to the end', () => {
    ClearV1();
    let data = getData();
    let userHandleTest = authRegisterV1('concatenated@gmail.com', 'Concatenation', 'Khabib', 'Nurmagomedovshapirov');
    let userHandleTest2 = authRegisterV1('concatenated1@gmail.com', 'Concatenation', 'Khabib', 'Nurmagomedovshapirov');
    expect(data.users[1].userHandle).toEqual(data.users[0].userHandle + '0');
  });

  test('test 9: user handle is concatenated and then has numbers added to the end twice', () => {
    ClearV1();
    let data = getData();
    let userHandleTest = authRegisterV1('concatenated@gmail.com', 'Concatenation', 'Khabib', 'Nurmagomedovshapirov');
    let userHandleTest2 = authRegisterV1('concatenated1@gmail.com', 'Concatenation', 'Khabib', 'Nurmagomedovshapirov');
    let userHandleTest3 = authRegisterV1('concatenated2@gmail.com', 'Concatenation', 'Khabib', 'Nurmagomedovshapirov');
    expect(data.users[2].userHandle).toEqual(data.users[1].userHandle + '1');
  });

  test('test 10: succesful use of authRegisterV1', () => {
    ClearV1();
    let data = getData();
    expect(authRegisterV1('validemail@gmail.com', 'password', 'first', 'last')).toEqual({authUserId: data.users[0].authUserId});
    expect(authRegisterV1('validemail1@gmail.com', 'password1', 'first', 'last')).toEqual({authUserId: data.users[1].authUserId});
    expect(authRegisterV1('validemail2@gmail.com', 'password2', 'first', 'last')).toEqual({authUserId: data.users[2].authUserId});
  });
});

describe('tests for the authLoginV1 function', () => {
  test('test 1: email doesnt belong to a user', () => {
    ClearV1();
    let loginTest = authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James');
    expect(authLoginV1('Wrongemail@gmail.com', 'password')).toEqual({error: 'Email entered does not belong to a user'});
  });

  test('test 2: incorrect password is entered', () => {
    ClearV1();
    let loginTest = authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James');
    expect(authLoginV1('validemail@gmail.com', 'wrongPassword')).toEqual({error: 'Incorrect password has been entered'});
  });

  test('test 3: succesful login', () => {
    ClearV1();
    let loginTest = authRegisterV1('Validemail@gmail.com', 'password', 'Lebron', 'James');
    let data = getData();
    expect(authLoginV1('validemail@gmail.com', 'password')).toEqual(data.users[0].authUserId);
  })
});