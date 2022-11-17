import { getData, setData } from './dataStore';
import { findUser, validToken, userStatsChanges, workplaceStatsChanges } from './helperfunctions';
import { dm } from './interface';
import HTTPError from 'http-errors';

interface dmlist {
  dmId: number,
  name: string
}

interface user {
  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  profileImgUrl: string,
  handleStr: string
}

let Id = 1;
/**
 * Creates a dm between the user (owner) and any additional users
 *
 * @param {string} token
 * @param {array} uIds
 * @returns {number} dmId
 */

function dmCreateV1(token: string, uIds: Array<number>) {
  const data = getData();

  // invalid token
  if (validToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  // invalid user Id
  for (const uId of uIds) {
    if (data.users[uId] === undefined) {
      throw HTTPError(400, 'a uId in uIds does not refer to a valid user');
    }
  }

  // duplicate user Id
  function hasDuplicates(array: number[]) {
    return (new Set(array)).size === array.length;
  }

  if (!hasDuplicates(uIds)) {
    throw HTTPError(400, 'there are duplicate uId\'s in uIds');
  }

  // owner in uIds
  const currentUser = findUser(token);

  for (const uId of uIds) {
    if (uId === currentUser.uId) {
      throw HTTPError(400, 'owner is part of uIds');
    }
  }

  let name = currentUser.handleStr;

  for (const element of uIds) {
    name = name + ', ' + data.users[element].handleStr;
  }

  const membersArray = uIds;
  membersArray.push(currentUser.uId);

  // need to do this

  let uIdindex;
  for (const user of data.users) {
    if (uIds.includes(user.uId)) {
      uIdindex = (data.users).indexOf(user);
      userStatsChanges('dms', uIdindex, 'add');
    }
  }
  workplaceStatsChanges('dms', 'add');

  const dm: dm = {
    dmId: data.dms.length,
    name: name,
    owner: currentUser.uId,
    members: membersArray,
    messages: [],
  };

  data.dms[data.dms.length] = dm;
  setData(data);

  return {
    dmId: data.dms.length - 1,
  };
}

/**
 * Returns the list of DMs that the user is a member of.
 *
 * @param {String} token
 * @returns {Object} dms
 */
function dmListV1 (token: string): object {
  const data = getData();

  // invalid token error
  if (validToken(token) === false) {
    throw HTTPError(403, 'Invalid token');
  }

  const currentUser = findUser(token);
  const dmArray: Array<dmlist> = [];

  // create array of dms
  for (const dm of data.dms) {
    if (dm.members.includes(currentUser.uId)) {
      dmArray.push({ dmId: dm.dmId, name: dm.name });
    }
  }

  return { dms: dmArray };
}

/**
 * Remove an existing DM, so all members are no longer in the DM.
 * This can only be done by the original creator of the DM.
 *
 * @param {String} token
 * @param {Number} dmId
 * @returns {}
 */
function dmRemoveV1 (token: string, dmId: number) {
  const data = getData();

  // Invalid token error
  if (validToken(token) === false) {
    throw HTTPError(403, 'Invalid token');
  }

  // Invalid dmId error
  const currentDm = data.dms.find(d => d.dmId === dmId);
  if (currentDm === undefined) {
    throw HTTPError(400, 'Invalid dmId');
  }

  const currentUser = findUser(token);

  // User is not a member of DM error
  if (data.dms[dmId].members.includes(currentUser.uId) === false) {
    throw HTTPError(403, `User(${token}) is not a member of the dm(${dmId})`);
  }

  // User is not the original DM creator
  if (currentUser.uId !== data.dms[dmId].owner) {
    throw HTTPError(403, `User(${token}) is not the original creator of the dm(${dmId})`);
  }

  const dmArray: Array<dm> = [];
  let dmToRemove;
  // Creates a new array of the DMs excluding the one to be removed
  for (const dm of data.dms) {
    if (dm.dmId !== dmId) {
      dmArray.push(dm);
    } else {
      dmToRemove = dm;
    }
  }

  data.dms = dmArray;

  const users: number[] = dmToRemove.members;
  for (const user of users) {
    userStatsChanges('dms', user, 'remove');
  }
  const messages = dmToRemove.messages;
  for (const msg of messages) {
    userStatsChanges('messages', msg.uId, 'remove');
  }

  workplaceStatsChanges('dms', 'remove');
  setData(data);
  return {};
}

/**
 * Given a DM with ID dmId that the authorised user
 * is a member of, provide basic details about the DM.
 *
 * @param {String} token
 * @param {Number} dmId
 * @returns {Object} name, members
 */
function dmDetailsV1 (token: string, dmId: number) {
  const data = getData();

  // Invalid token error
  if (validToken(token) === false) {
    throw HTTPError(403, 'Invalid token');
  }

  // Invalid dmId error
  const currentDm = data.dms.find(d => d.dmId === dmId);
  if (currentDm === undefined) {
    throw HTTPError(400, 'Invalid dmId');
  }

  const currentUser = findUser(token);

  // User is not a member of DM error
  if (data.dms[dmId].members.includes(currentUser.uId) === false) {
    throw HTTPError(403, `User(${token}) is not a member of the dm(${dmId})`);
  }

  // Create members array output and set the owner as the first member listed
  const membersArray: Array<user> = [
    {
      uId: currentUser.uId,
      email: currentUser.email,
      nameFirst: currentUser.nameFirst,
      nameLast: currentUser.nameLast,
      handleStr: currentUser.handleStr,
      profileImgUrl: currentUser.profileImgUrl,
    }
  ];

  for (const member of data.dms[dmId].members) {
    membersArray.push({
      uId: data.users[member].uId,
      email: data.users[member].email,
      nameFirst: data.users[member].nameFirst,
      nameLast: data.users[member].nameLast,
      handleStr: data.users[member].handleStr,
      profileImgUrl: data.users[member].profileImgUrl
    });
  }

  // Remove the owner because they get repeated at the end
  membersArray.pop();

  return {
    name: currentDm.name,
    members: membersArray
  };
}

/**
 * Given a DM with ID dmId, the user is removed as a member of this DM.
 * The creator is allowed to leave and the DM will still exist if this happens.
 * This does not update the name of the DM.
 *
 * @param {String} token
 * @param {Number} dmId
 * @returns {}
 */
function dmLeaveV1 (token: string, dmId: number) {
  const data = getData();

  // Invalid token error
  if (validToken(token) === false) {
    throw HTTPError(403, 'Invalid token');
  }

  // Invalid dmId error
  const currentDm = data.dms.find(d => d.dmId === dmId);
  if (currentDm === undefined) {
    throw HTTPError(400, 'Invalid dmId');
  }

  const currentUser = findUser(token);

  // User is not a member of DM error
  if (data.dms[dmId].members.includes(currentUser.uId) === false) {
    throw HTTPError(403, `User(${token}) is not a member of the dm(${dmId})`);
  }

  const Index = data.dms[dmId].members.indexOf(currentUser.uId);
  data.dms[dmId].members.splice(Index, 1);
  userStatsChanges('dms', currentUser.index, 'remove');

  setData(data);
  return {};
}

/**
 * Given a dm that user is a part of
 * checks message history form starting index
 * given most recent message has index 0
 *
 * @param {string} token
 * @param {number} dmId
 * @param {number} start
 * @returns {array} messages - returns an array of messages either empty or with messages
 * @returns {number} start - returns the start value passed in
 * @returns {number} end - returns -1 indicating no more messages after this return
 */

function dmMessagesV1(token: string, dmId: number, start: number) {
  const data = getData();

  // Check for valid token
  if (validToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  // Check for valid dmId
  const isValidDm = data.dms.find(d => d.dmId === dmId);
  if (isValidDm === undefined) {
    throw HTTPError(400, 'invalid dmId');
  }

  const currentUser = findUser(token);

  // User is not a member of DM error
  if (data.dms[dmId].members.includes(currentUser.uId) === false) {
    throw HTTPError(403, 'user is not a member of the DM');
  }

  const messages = data.dms[dmId].messages;
  const numberOfMessages = messages.length;
  let end: number;
  let messagesArray;

  // Check whether starting index is < 0
  if (start < 0) {
    throw HTTPError(400, 'start is greater than the total number of messages in the channel');
  } else if (start === numberOfMessages || numberOfMessages === undefined) {
    return {
      messages: [],
      start: start,
      end: -1,
    };
  } else if (start >= 0 && start > numberOfMessages) {
    // If starting index is greater than the number of messages sent in the dm
    throw HTTPError(400, 'start is greater than the total number of messages in the channel');
  } else if (start >= 0 && start < numberOfMessages) {
    // If starting index is 0 or a multiple of 50
    if (start + 50 < numberOfMessages) {
      end = start + 50;
      messagesArray = messages.slice(start, end);
    } else if (start + 50 >= numberOfMessages) {
      // If there is < 50 messages left in the dm history, end pagination
      messagesArray = messages.slice(start);
      end = -1;
    }

    console.log(`{ [messages], ${start}, ${end} }`);
    return {
      messages: messagesArray,
      start: start,
      end: end,
    };
  }
}

/**
 * Sends a message in the specified dm that user is a part of
 *
 * @param {string} token
 * @param {number} dmId
 * @param {string} message
 * @returns {number} messageId
 */

function messageSendDmV1(token: string, dmId: number, message: string) {
  const data = getData();

  // Check for valid token
  if (validToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  // Check for valid dmId
  const isValidDm = data.dms.find(d => d.dmId === dmId);
  if (isValidDm === undefined) {
    throw HTTPError(400, 'invalid dmId');
  }

  const user = findUser(token);
  const checkIsMember = data.dms[dmId].members;
  if (checkIsMember.includes(user.uId) === false || data.dms[dmId].owner !== user.uId) {
    throw HTTPError(403, 'user is not a member of the DM');
  }

  // Check length of message
  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'length of message is less than 1 or over 1000 characters');
  }

  const time = Math.floor(Date.now() / 1000);

  const newMessage = {
    messageId: Id,
    uId: user.uId,
    message: message,
    timeSent: time,
    reacts: [],
    isPinned: false
  };
  workplaceStatsChanges('messages', 'add');
  data.dms[dmId].messages.unshift(newMessage);
  userStatsChanges('messages', user.index, 'add');

  setData(data);

  Id = Id + 2;

  return {
    messageId: Id - 2
  };
}

export { dmCreateV1, dmListV1, dmRemoveV1, dmDetailsV1, dmLeaveV1, dmMessagesV1, messageSendDmV1 };
