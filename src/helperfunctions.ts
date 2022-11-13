import validator from 'validator';
import { getData, setData } from './dataStore';
import { User } from './users';

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

  const isAlphaNumeric = (str: string) => /^[a-z0-9]+$/gi.test(str);
  return isAlphaNumeric(handleStr);
}

function extractUser(uId?: number): User | User[] {
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
  let usersArrayIndex;

  for (const element of data.users) {
    for (const tokens of element.tokens) {
      if (tokens === token) {
        userObject = element;
        usersArrayIndex = (data.users).indexOf(element);
      }
    }
  }

  return {
    index: usersArrayIndex,
    uId: userObject.uId,
    email: userObject.email,
    password: userObject.password,
    nameFirst: userObject.nameFirst,
    nameLast: userObject.nameLast,
    handleStr: userObject.handleStr,
    channelsJoined: userObject.channelsJoined,
    dmsJoined: userObject.dmsJoined,
    messagesSent: userObject.messagesSent,
    tokens: userObject.tokens,
  };
}

// parameters are channels, dms and messages - index is for finding one user only
function findNumberOf(parameter: string, index?: number): number {
  const data = getData();

  if (index === undefined) {
    if (parameter === 'channels') {
      return data.channels.length;
    } else if (parameter === 'dms') {
      return data.dms.length;
    } else if (parameter === 'messages') {
      let numMessages = 0;
      for (const channel of data.channels) {
        numMessages += channel.messages.length;
      }
      for (const dm of data.dms) {
        numMessages += dm.messages.length;
      }
      return numMessages;
    }
  } else {
    const user = data.users[index];

    if (parameter === 'channels') {
      if (user.channelsJoined.length === 0) {
        return 0;
      } else {
        const lastElement = (user.channelsJoined).slice(-1);
        return lastElement[0].numChannelsJoined;
      }
    } else if (parameter === 'dms') {
      if (user.dmsJoined.length === 0) {
        return 0;
      } else {
        const lastElement = (user.dmsJoined).slice(-1);
        return lastElement[0].numDmsJoined;
      }
    } else if (parameter === 'messages') {
      if (user.messagesSent.length === 0) {
        return 0;
      } else {
        const lastElement = (user.messagesSent).slice(-1);
        return lastElement[0].numMessagesSent;
      }
    }
  }
}

function validMessage(messageId: number) {
  const data = getData();
  let a;
  if (messageId % 2 === 0) {
    for (const element of data.channels) {
      a = element.messages.find(a => a.messageId === messageId);
      if (a !== undefined) {
        return true;
      }
    }
    return false;
  } else {
    for (const element of data.dms) {
      a = element.messages.find(a => a.messageId === messageId);
      if (a !== undefined) {
        return true;
      }
    }
    return false;
  }
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
          messageObject = message;
          channelID = element.dmId;
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

function userStatsChanges (parameter: string, userIndex: number, operation: string) {
  const data = getData();
  const time = Math.floor(Date.now() / 1000);
  if (parameter === 'channels') {
    const userchannels = findNumberOf('channels', userIndex);
    if (operation === 'add') {
      (data.users[userIndex].channelsJoined).push(
        {
          numChannelsJoined: userchannels + 1,
          timeStamp: time
        }
      );
    } else if (operation === 'remove') {
      (data.users[userIndex].channelsJoined).push(
        {
          numChannelsJoined: userchannels - 1,
          timeStamp: time
        }
      );
    }
  } else if (parameter === 'dms') {
    const userdms = findNumberOf('dms', userIndex);
    if (operation === 'add') {
      (data.users[userIndex].dmsJoined).push(
        {
          numDmsJoined: userdms + 1,
          timeStamp: time
        }
      );
    } else if (operation === 'remove') {
      (data.users[userIndex].dmsJoined).push(
        {
          numDmsJoined: userdms - 1,
          timeStamp: time
        }
      );
    }
  } else if (parameter === 'messages') {
    const usermessages = findNumberOf('messages', userIndex);
    if (operation === 'add') {
      (data.users[userIndex].messagesSent).push(
        {
          numMessagesSent: usermessages + 1,
          timeStamp: time
        }
      );
    } else if (operation === 'remove') {
      (data.users[userIndex].messagesSent).push(
        {
          numMessagesSent: usermessages - 1,
          timeStamp: time
        }
      );
    }
  }
  console.log(parameter, userIndex, operation);
  setData(data);
  return {};
}

function workplaceStatsChanges (parameter: string, operation: string) {
  const data = getData();
  const time = Math.floor(Date.now() / 1000);
  console.log(data);
  if (parameter === 'channels') {
    const workplaceChannels = findNumberOf('channels');
    if (operation === 'add') {
      (data.stats.channelsExist).push(
        {
          numChannelsExist: workplaceChannels + 1,
          timeStamp: time
        }
      );
    }
  } else if (parameter === 'dms') {
    const workplaceDms = findNumberOf('dms');
    if (operation === 'add') {
      (data.stats.dmsExist).push(
        {
          numDmsExist: workplaceDms + 1,
          timeStamp: time
        }
      );
    } else if (operation === 'remove') {
      (data.stats.dmsExist).push(
        {
          numDmsExist: workplaceDms - 1,
          timeStamp: time
        }
      );
    }
  } else if (parameter === 'messages') {
    const workplaceMessages = findNumberOf('messages');
    if (operation === 'add') {
      (data.stats.messagesExist).push(
        {
          numMessagesExist: workplaceMessages + 1,
          timeStamp: time
        }
      );
    } else if (operation === 'remove') {
      (data.stats.messagesExist).push(
        {
          numMessagesExist: workplaceMessages - 1,
          timeStamp: time
        }
      );
    }
  }
  console.log(parameter, operation);
  setData(data);
  return {};
}

function getMessageType(messageId: number) { 
  let dataType = 'channels'; 
  if (messageId % 2 !== 0) { 
    dataType = 'dms'; 
  } 
  return dataType; 
}

function dupeReact(uID: number, messageId: number, messageIndex: number, channelId: number) { 
  const data = getData();

  let type = getMessageType(messageId);
  for (let i of data[type][channelId].messages[messageIndex].reacts) { 
    if (i.uIds.includes(uID)) { 
      return true;
    }
  }
  return false;
}

export { getMessageType, dupeReact, validEmail, validToken, validUId, validName, validHandleStr, extractUser, findUser, findNumberOf, findMessage, validMessage, userStatsChanges, workplaceStatsChanges };
