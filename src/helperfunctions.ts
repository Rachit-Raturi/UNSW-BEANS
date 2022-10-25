
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
    isValidToken = element.tokens.find(a => a === token);
    if (isValidToken !== undefined) {
      return true;
    }
  }
  return false;
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

setData({
  users: [
    {
      uId: 0,
      email: 'bot@hotmail.com',
      password: '12345',
      nameFirst: 'Beep',
      nameLast: 'Boop',
      handleStr: 'beepboop',
      tokens: [
        'botcode111',
        'botcode222',
      ],
    },
    {
      uId: 1,
      email: 'robot@gmail.com',
      password: 'qwerty',
      nameFirst: 'Beep',
      nameLast: 'Boop',
      handleStr: 'beepboop0',
      tokens: [
        'botcodeabc',
        'botcodeqqq',
      ],
    },
    {
      uId: 2,
      email: 'random@outlook.com',
      password: 'a8#r2fah51sD',
      nameFirst: 'this-is@-very',
      nameLast: 'ab%l0ne',
      handleStr: 'thisisveryablne',
      tokens: [
        'squid',
        'octopus',
        'starfish',
        'cow',
        'yes',
      ],
    },
    {
      uId: 3,
      email: 'sumeru@gmail.com',
      password: 'hEter0chTom@tic',
      nameFirst: 'Candace',
      nameLast: 'Deshret',
      handleStr: 'candacedeshret',
      tokens: [
        'loneliness',
      ],
    },
  ],
  channels: [
    { channelId: 0,
      name: 'bot chat',
      isPublic: false,
      ownerMembers: [0],
      allMembers: [1],
      messages: [

      ],
    },
    { channelId: 1,
      name: `don't ask`,
      isPublic: true,
      ownerMembers: [3],
      allMembers: [0,1,2],
      messages: [
        
      ],
    },
    { channelId: 2,
      name: 'random memes',
      isPublic: true,
      ownerMembers: [2],
      allMembers: [0,3,1],
      messages: [
        
      ],
    },
  ],
  dms: [
  ]

});
console.log(validEmail('valid@gmail.com'));
console.log(validEmail('invalid'));
console.log(validEmail('sumeru@gmail.com'));
/*
console.log(validToken());
console.log(validUId());
console.log(validHandleStr());
console.log(extractUser());
*/

export { validEmail, validToken, validUId, validName, validHandleStr, extractUser, findUser };

