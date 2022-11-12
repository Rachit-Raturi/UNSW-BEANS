import { getData, setData } from './dataStore';
import { validToken, validUId, validName, validHandleStr, validEmail, extractUser, findUser, findNumberOf } from './helperfunctions';
import HTTPError from 'http-errors';

export interface User {
  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string
}

/**
 * Given a token views a user's profile
 *
 * @param {string} token
 * @param {number} uId
 * @returns {user} user
 */

function userProfileV1 (token: string, uId: number): { user: User | User[]} {
  if (validToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }
  if (validUId(uId) === false) {
    throw HTTPError(400, 'invalid uId');
  }

  return { user: extractUser(uId) };
}

/**
 * Given a token views a all users
 *
 * @param {string} token
 * @returns {Array<user>} users
 */
function usersAllV1 (token: string): { users: User | User[]} {
  if (validToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }
  console.log(validToken(token));
  return { users: extractUser() };
}

function userSetNameV1 (token: string, nameFirst: string, nameLast: string) {
  const data = getData();
  if (validToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  if (validName(nameFirst) === false) {
    throw HTTPError(400, 'invalid first name');
  }

  if (validName(nameLast) === false) {
    throw HTTPError(400, 'invalid last name');
  }

  console.log(validToken(token), validName(nameFirst), validName(nameLast));
  const index = findUser(token).index;
  data.users[index].nameFirst = nameFirst;
  data.users[index].nameLast = nameLast;
  setData(data);
  return {};
}

/**
 * Given a token changes the userhandle of the user
 *
 * @param {string} token
 * @param {string} handleStr
 * @returns {}
 */
function userSetHandleV1 (token: string, handleStr: string) {
  const data = getData();
  if (validToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  if (validHandleStr(handleStr) === false) {
    throw HTTPError(400, 'invalid userhandle');
  }

  console.log(validToken(token), validHandleStr(handleStr));
  const index = findUser(token).index;
  data.users[index].handleStr = handleStr;
  setData(data);
  return {};
}

/**
 * Given a token changes the userhandle of the user
 *
 * @param {string} token
 * @param {string} email
 * @returns {}
 */
function userSetEmailV1 (token: string, email: string) {
  const data = getData();
  if (validToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  if (validEmail(email) === false) {
    throw HTTPError(400, 'invalid email');
  }
  console.log(validToken(token), validEmail(email));
  const index = findUser(token).index;
  data.users[index].email = email;
  setData(data);
  return {};
}

function userStats (token: string) {
  if (validToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  const currentUser = findUser(token);

  // current user stats
  const numberChannels = findNumberOf('channels', currentUser.index);
  const numberDms = findNumberOf('dms', currentUser.index);
  const numberMessages = findNumberOf('messages', currentUser.index);

  // all user stats
  const totalChannels = findNumberOf('channels');
  const totalDms = findNumberOf('dms');
  const totalMessages = findNumberOf('messages');

  console.log(numberChannels);
  console.log(numberDms);
  console.log(numberMessages);
  console.log(totalChannels);
  console.log(totalDms);
  console.log(totalMessages);
  let involvementRate = 0;

  if ((totalChannels + totalDms + totalMessages) === 0) {
    involvementRate = 0;
  } else {
    involvementRate = (numberChannels + numberDms + numberMessages) / (totalChannels + totalDms + totalMessages);
  }

  if (involvementRate > 1) {
    involvementRate = 1;
  }
  console.log(involvementRate);

  return {
    userStats: {
      channelsJoined: currentUser.channelsJoined,
      dmsJoined: currentUser.dmsJoined,
      messagesSent: currentUser.messagesSent,
      involvementRate: involvementRate
    }
  };
}

export { userProfileV1, usersAllV1, userSetNameV1, userSetHandleV1, userSetEmailV1, userStats };
