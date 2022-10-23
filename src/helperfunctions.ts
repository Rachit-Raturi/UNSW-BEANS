
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


setData(
  {users: [
    {
      uId: 0,
      email: 'bot@hotmail.com',
      password: '12345',
      nameFirst: 'Beep',
      nameLast: 'Boop',
      handleStr: 'beepboop',
    },
    {
      uId: 1,
      email: 'robot@gmail.com',
      password: 'qwerty',
      nameFirst: 'Beep',
      nameLast: 'Boop',
      handleStr: 'beepboop0',
    },
    {
      uId: 2,
      email: 'random@outlook.com',
      password: 'a8#r2fah51sD',
      nameFirst: 'this-is@-very',
      nameLast: 'ab%l0ne',
      handleStr: 'thisisveryablne',
    },
    {
      uId: 3,
      email: 'sumeru@gmail.com',
      password: 'hEter0chTom@tic',
      nameFirst: 'Candace',
      nameLast: 'Deshret',
      handleStr: 'candacedeshret',
    }
  ]
}
)
console.log(validHandleStr('app#'));
console.log(extractUser(0));
console.log(extractUser());

export { validEmail, validToken, validName, validHandleStr, extractUser, findUser };

