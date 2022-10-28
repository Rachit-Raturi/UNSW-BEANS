import validator from 'validator';
import { getData } from './dataStore';

function validEmail(email: string): boolean {
  const data = getData();
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
  const data = getData();
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
  const data = getData();

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
  const data = getData();

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
  const data = getData();

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
    };
  }
}

function findUser(token: string) {
  const data = getData();
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

function validMessage(messageId: number) {
  const data = getData();
  let a;
  for (const element of data.channels) {
    a = element.messages.find(a => a.messageId === messageId);
    if (a !== undefined) {
      return true;
    }
  }
  return false;
}

// assumes valid messageId
function findMessage(messageId: number) {
  const data = getData();
  let messageObject;
  let channelID;
  let indexTemp;
  let index;

  if (messageId % 2 === 0) {
    for (const element of data.channels) {
      indexTemp = 0;
      for (const message of element.messages) {
        if (message.messageId === messageId) {
          messageObject = message;
          channelID = element.channelId;
          index = indexTemp;
          break;
        }
        indexTemp++;
      }
    }
  } else {
    for (const element of data.dms) {
      for (const message of element.messages) {
        indexTemp = 0;
        if (message.messageId === messageId) {
          messageObject = element;
          channelID = element.channelId;
          index = indexTemp;
          break;
        }
        indexTemp++;
      }
    }
  }

  return {
    messageId: messageObject.messageId,
    uId: messageObject.uId,
    message: messageObject.message,
    timeSent: messageObject.timeSent,
    channelID: channelID,
    index: index
  };
}

export { validEmail, validToken, validUId, validName, validHandleStr, extractUser, findUser, findMessage, validMessage };
