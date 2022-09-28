import authRegisterV1 from './auth';


describe('tests', () => {
  test('test 1: invalid email', () => {
    expect(authRegisterV1('Invalidemail@@gmail.com', 'password', 'Rachit', 'Raturi')).toEqual({error: 'Invalid email entered'});
  });

  test ('test 2: email address already in use', () => {
    let result = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella')).toEqual({error: 'Email is already in use'});
  });

  test('test 3: password is not strong enough', () => {
    expect(authRegisterV1('weakpassword@gmail.com', 'weak', 'Jackson', 'Smith')).toEqual({error: 'Password is less than 6 characters'})
  });

  test('test 4: empty password', () => {
    expect(authRegisterV1('nopassword@gmail.com', '', 'David', 'Jones')).toEqual({error: 'No password was entered'})
  });

  test('test 5: first name isnt valid', () => {
    expect(authRegisterV1('nofirst@gmail.com', 'pastword', 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz',
                          'Jameson')).toEqual({error: 'First name is not between 1 to 50 characters inclusive'})
  });

  test('test 6: second name isnt valid', () => {
    expect(authRegisterV1('nofirst@gmail.com', 'pastword', 'colin',
                          'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabc')).toEqual({error: 'Last name is not between 1 to 50 characters inclusive'})
  });
});