
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
  let isValidToken;

  for (const element of data.users) {
    isValidToken = element.tokens.find(a => a.token === token);
    if (isValidToken !== undefined) {
      return true;
    }
  }

  return false;
}

function validName(name: string): boolean {

  if (name.length < 1 || name.length > 50) {
    return false;
  }

  return true;
}

function validHandleStr(handleStr: string): boolean {
  let data = getData();

  if (handleStr.length < 3 || handleStr.length > 20) {
    return false;
  }

  for (const users of data.users) {
    if (users.handleStr === handleStr) {
      return false;
    }
  }

  const isAlphaNumeric = str => /^[a-z0-9]+$/gi.test(str);

  return isAlphaNumeric;
}






function findUser(token: string): object {
  let data = getData();
  let userObject: object;

  for (const element of data.users) {
    for (const tokens of element.tokens) {
      if (tokens.token === token) {
        userObject = element;
      }
    }
  }

  return userObject;
}

export { validEmail, validToken, validName, validHandleStr, findUser };

