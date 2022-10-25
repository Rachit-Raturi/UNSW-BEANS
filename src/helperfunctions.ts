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
  if (findUser(token) === undefined) {
    return false; 
  }
  return true;
}

function validUId(uId: number): boolean {
  let data = getData();

  const isValidUId = data.users.find(a => a.uId === uId);

    if (isValidUId === undefined) {
      return false;
    }

  return true;
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
  return isAlphaNumeric(handleStr);
}

function extractUser(uId?: number) {
  let data = getData();

  if (uId === undefined) {
    const usersArray = [];
    
    for (const element of data.users) {
      usersArray.push(
        {
          uId: element.uId,
          email: element.email,
          nameFirst: element.nameFirst,
          nameLast: element.nameLast,
          handleStr: element.handleStr,
        }
      );
    }

    return usersArray;

  } else {
    return {
      uId: data.users[uId].uId,
      email: data.users[uId].email,
      nameFirst: data.users[uId].nameFirst,
      nameLast: data.users[uId].nameLast,
      handleStr: data.users[uId].handleStr,
    }
  }
}

function extractchannels(all?: boolean) {
  let data = getData();
}


function findUser(token: string) {
  let data = getData();
  let userObject;

  for (const element of data.users) {
    for (const tokens of element.tokens) {
      if (tokens === token) {
        userObject = element;
      }
    }
  }

  return {
    uId: userObject.uId,
    email: userObject.email,
    password: userObject.password,
    nameFirst: userObject.nameFirst,
    nameLast: userObject.nameLast,
    handleStr: userObject.handleStr,
    tokens: userObject.tokens,
  };
}

export { validEmail, validToken, validUId, validName, validHandleStr, extractUser, findUser };
