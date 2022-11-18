import { getData, setData } from './dataStore';
import { validToken, validUId, validName, validHandleStr, validEmail, extractUser, findUser, findNumberOf } from './helperfunctions';
import HTTPError from 'http-errors';
import request from 'sync-request';
import fs from 'fs';

export interface User {
  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  profileImgUrl: string,
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

/**
 * Given a token fetches the users stats
 *
 * @param {string} token
 * @returns {array} channelsJoined
 * @returns {array} dmsJoined
 * @returns {array} messagesSent
 * @returns {number} involvementRate
 */
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
  let involvementRate = 0;

  // involvement rate denominator < 0
  if ((totalChannels + totalDms + totalMessages) === 0) {
    involvementRate = 0;
  } else {
    involvementRate = (numberChannels + numberDms + numberMessages) / (totalChannels + totalDms + totalMessages);
  }

    // cap involvement rate at 1
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

/**
 * Given a token fetches the workplace stats
 *
 * @param {string} token
 * @returns {array} channelsExist
 * @returns {array} dmsExist
 * @returns {array} messagesExist
 * @returns {number} utilizationRate
 */

function usersStats (token: string) {
  // check if token is valid
  if (validToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  const data = getData();
  const notUtilisedArray = [];
  for (const user of data.users) {
    notUtilisedArray.push(user.uId);
  }

  // create array of users that are not in a channel
  for (const channel of data.channels) {
    for (const member of channel.allMembers) {
      if (notUtilisedArray.includes(member)) {
        const memberindex = notUtilisedArray.indexOf(member);
        notUtilisedArray.splice(memberindex, 1);
      }
    }
  }

  // create array of users that are not in a dm
  for (const dm of data.dms) {
    for (const member of dm.members) {
      if (notUtilisedArray.includes(member)) {
        const memberindex = notUtilisedArray.indexOf(member);
        notUtilisedArray.splice(memberindex, 1);
      }
    }
  }
  const numerator = data.users.length - notUtilisedArray.length;
  const utilizationRate: number = numerator / data.users.length;

  return {
    workspaceStats: {
      channelsExist: data.stats.channelsExist,
      dmsExist: data.stats.dmsExist,
      messagesExist: data.stats.messagesExist,
      utilizationRate: utilizationRate
    }
  };
}

/**
 * Given a image url, sets the user profile picture to that image
 *
 * @param {string} token
 * @param {string} imgUrl
 * @param {number} xStart
 * @param {number} yStart
 * @param {number} xEnd
 * @param {number} yEnd
 * @returns {}
 */
function userPhoto (token: string, imgUrl: string, xStart: number, yStart: number, xEnd: number, yEnd: number) {
  const data = getData();

  if (validToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  if (xEnd <= xStart || yEnd <= yStart) {
    throw HTTPError(400, 'invalid x or y values');
  }

  if (!(imgUrl.includes('.jpg'))) {
    throw HTTPError(400, 'image is not a jpg');
  }

  const user = findUser(token);
  const uId: number = user.uId;
  const uIdString: string = uId.toString();
  const res = request(
    'GET',
    imgUrl
  );
  const body = res.getBody();
  const filename: string = 'imgurl/' + uIdString + '.jpg';
  console.log(filename);
  fs.writeFileSync(filename, body, { flag: 'w' });

  const sizeOf = require('image-size');
  const dimensions = sizeOf(filename);
  console.log(dimensions.width, dimensions.height);
  const w = dimensions.width;
  const h = dimensions.height;

  if (xStart < 0 || xEnd < 0 || xStart > w || xEnd > w) {
    throw HTTPError(400, 'crop x-dimensions outside of image bounds');
  }

  if (yStart < 0 || yEnd < 0 || yStart > h || yEnd > h) {
    throw HTTPError(400, 'crop y-dimensions outside of image bounds');
  }

  const Jimp = require('jimp');
  const width = xEnd - xStart;
  const height = yEnd - yStart;

  async function crop() {
    // Reading Image
    const image = await Jimp.read(filename);
    image.crop(xStart, yStart, width, height).write('imgurl/' + uIdString + 'crop' + '.jpg');
  }

  crop(); // Calling the function here using async
  console.log('Image is processed successfully');
  data.users[user.index].profileImgUrl = 'http://localhost:3200/' + 'imgurl/' + uIdString + 'crop' + '.jpg';
  return {};
}

export { userProfileV1, usersAllV1, userSetNameV1, userSetHandleV1, userSetEmailV1, userStats, usersStats, userPhoto };
