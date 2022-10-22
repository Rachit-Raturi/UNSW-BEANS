import validator from 'validator';
import { getData, setData } from './dataStore';

function validEmail(email: string): boolean {
  let data = getData();
  if (!validator.isEmail(email)) {
    return false;
  }

  for (const users of data.users) {
    if (users.email === email) {
      return false;
    }
  }

  return true;
}

function validToken(token: string): boolean {
  let data = getData();
  const isValidToken = data.users.find(a => a.token === token);
  if (isValidToken === undefined) {
    return false;
  }
  console.log(isValidToken);
  return true;
}


function findUser(token: string): object {
  let data = getData();
  let userObject: object;
  for (const element of data.users) {
    if (element.token === token) {
      userObject = element;
    }
  }
  return userObject;
}

export { validEmail, validToken, findUser };

