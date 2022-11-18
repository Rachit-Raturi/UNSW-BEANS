import { getData, setData } from './dataStore';
import {
  findUser,
  validToken,
  findMessage,
  validMessage,
  userStatsChanges,
  workplaceStatsChanges,
  getMessageType,
  dupeReact
} from './helperfunctions';
import HTTPError from 'http-errors';
/**
 *
 * Given a channel with ID channelId that the authorised user
 * is a member of, provides basic details about the channel.
 *
 * @param {string} token
 * @param {number} channelId
 * @param {string} message
 * @returns {number} messageId
 */

let Id = 0;
function resetId() {
  Id = 0;
}

function messageSendV1(token: string, channelId: number, message: string) {
  const data = getData();
  if (validToken(token) === false) {
    throw HTTPError(403, 'Inavlid user token');
  }

  if (data.channels[channelId] === undefined) {
    throw HTTPError(400, 'Channel does not exist');
  }

  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'Invalid message length');
  }

  const user = findUser(token);
  const checkIsMember = data.channels[channelId].allMembers;
  if (checkIsMember.includes(user.uId) === false) {
    throw HTTPError(403, 'Channel does not exist');
  }

  const time = Math.floor(Date.now() / 1000);

  const newMessage = {
    messageId: Id,
    uId: user.uId,
    message: message,
    timeSent: time,
    reacts: [],
    isPinned: false,
  };

  userStatsChanges('messages', user.index, 'add');
  workplaceStatsChanges('messages', 'add');
  data.channels[channelId].messages.unshift(newMessage);
  setData(data);

  Id = Id + 2;
  return { messageId: Id - 2 };
}

/**
 * Given a messageId that the user is authorised to manipulate,
 * changes the actual message string from a channel or dm.
 *
 * @param {string} token
 * @param {number} messageId
 * @param {string} message
 * @returns {}
 */
function messageEditV1(token: string, messageId: number, message: string) {
  const data = getData();
  if (validToken(token) === false) {
    throw HTTPError(403, 'Inavlid user token');
  }

  if (message.length > 1000) {
    throw HTTPError(400, 'Invalid message length');
  }

  if (validMessage(messageId) === false) {
    throw HTTPError(400, 'Channel does not exist');
  }

  // Owner can edit the message but members cannot
  const messageObject = findMessage(messageId);
  const user = findUser(token);
  if (messageId % 2 === 0) {
    const owner = data.channels[messageObject.channelID].ownerMembers;
    if (user.uId !== messageObject.uId && owner.includes(user.uId) === false) {
      throw HTTPError(403, 'Invalid permissions');
    }

    data.channels[messageObject.channelID].messages
      .find(m => m.messageId === messageObject.messageId).message = message;
  } else {
    const owner = data.dms[messageObject.channelID].owner;
    if (user.uId !== messageObject.uId && owner !== user.uId) {
      throw HTTPError(403, 'Invalid permissions');
    }
    data.dms[messageObject.channelID].messages
      .find(m => m.messageId === messageObject.messageId).message = message;
  }
  return {};
}

/**
 * Given a messageId that the user is authorised to manipulate,
 * deletes that message from the channel
 *
 * @param {string} token
 * @param {number} messageId
 * @returns {}
 */
function messageRemoveV1(token: string, messageId: number) {
  const data = getData();

  if (validToken(token) === false) {
    throw HTTPError(403, 'Inavlid user token');
  }

  if (validMessage(messageId) === false) {
    throw HTTPError(400, 'Inavlid Message');
  }

  const user = findUser(token);
  const messageObject = findMessage(messageId);

  if (messageId % 2 === 0) {
    const member = data.channels[messageObject.channelID].allMembers;
    const owner = data.channels[messageObject.channelID].ownerMembers;
    // user is not a member of this channel
    if (member.includes(user.uId) === false) {
      throw HTTPError(403, 'Invalid permissions');
    }

    if (messageObject.uId !== user.uId && (owner.includes(user.uId) === false)) {
      throw HTTPError(403, 'Invalid permissions');
    }
    data.channels[messageObject.channelID].messages.splice(messageObject.index, 1);
  } else {
    const member = data.dms[messageObject.channelID].members;
    const owner = data.dms[messageObject.channelID].owner;
    if (member.includes(user.uId) === false) {
      throw HTTPError(403, 'Invalid permissions');
    }

    if (messageObject.uId !== user.uId && (owner !== user.uId)) {
      throw HTTPError(403, 'Invalid permissions');
    }
    data.dms[messageObject.channelID].messages.splice(messageObject.index, 1);
  }
  workplaceStatsChanges('messages', 'remove');
  setData(data);
  return {};
}
/**
 * Given a messageId that the user is authorised to manipulate,
 * changes the actual message string from a channel or dm.
 *
 * @param {string} token
 * @param {number} messageId
 * @param {string} reactId
 * @returns {}
 */
function messageReact(token: string, messageId: number, reactId: number) {
  const data = getData();

  if (validToken(token) === false) {
    throw HTTPError(403, 'Inavlid user token');
  }

  if (validMessage(messageId) === false) {
    throw HTTPError(400, 'Inavlid Message');
  }

  const dataType = getMessageType(messageId);
  const message = findMessage(messageId);
  const authUserId = findUser(token);

  if (dataType === 'channels') {
    const members = data.channels[message.channelID].allMembers;
    if (members.includes(authUserId.uId) === false) {
      throw HTTPError(400, 'Invalid permissions');
    }
  } else {
    const members = data.dms[message.channelID].members;
    if (members.includes(authUserId.uId) === false) {
      throw HTTPError(400, 'Invalid permissions');
    }
  }

  if (reactId !== 1) {
    throw HTTPError(400, 'Inavlid Message');
  }

  if (dupeReact(authUserId.uId, messageId, message.index, message.channelID)) {
    throw HTTPError(400, 'Inavlid Message');
  }

  const path = data[dataType][message.channelID].messages[message.index];

  let allReacts = [authUserId.uId];
  if (path.reacts.length > 0) {
    for (const i of path.reacts) {
      if (i.uIds.includes(authUserId.uId) === false) {
        i.uIds.push(authUserId.uId);
        allReacts = i.uIds;
      }
    }
  }

  const newReact = {
    reactId: 1,
    uIds: allReacts,
    isThisUserReacted: true,
  };

  path.reacts.push(newReact);
  setData(data);
  return {};
}

function messageUnReact(token: string, messageId: number, reactId: number) {
  const data = getData();

  if (validToken(token) === false) {
    throw HTTPError(403, 'Inavlid user token');
  }

  if (validMessage(messageId) === false) {
    throw HTTPError(400, 'Inavlid Message');
  }

  const dataType = getMessageType(messageId);
  const message = findMessage(messageId);
  const authUserId = findUser(token);

  if (dataType === 'channels') {
    const members = data.channels[message.channelID].allMembers;
    if (members.includes(authUserId.uId) === false) {
      throw HTTPError(400, 'Invalid permissions');
    }
  } else {
    const members = data.dms[message.channelID].members;
    if (members.includes(authUserId.uId) === false) {
      throw HTTPError(400, 'Invalid permissions');
    }
  }

  if (reactId !== 1) {
    throw HTTPError(400, 'Inavlid Message');
  }

  if (message.reacts.length === 0) {
    throw HTTPError(400, 'Inavlid Message');
  }

  const path = data[dataType][message.channelID].messages[message.index];

  let index = -1;
  for (const i of path.reacts) {
    if (i.uIds.includes(authUserId.uId) === true) {
      const index1 = i.uIds.indexOf(authUserId.uId);
      i.uIds.splice(index1, 1);
    }
    index++;
  }

  path.reacts.splice(index, 1);
  return {};
}

function messagePin(token: string, messageId: number) {
  const data = getData();

  if (validToken(token) === false) {
    throw HTTPError(403, 'Inavlid user token');
  }

  if (validMessage(messageId) === false) {
    throw HTTPError(400, 'Inavlid Message');
  }

  const dataType = getMessageType(messageId);
  const message = findMessage(messageId);
  const authUserId = findUser(token);

  // Only owner can pin messages
  if (dataType === 'channels') {
    const owners = data.channels[message.channelID].ownerMembers;
    if (owners.includes(authUserId.uId) === false) {
      throw HTTPError(403, 'Invalid permissions');
    }
  } else {
    const owner = data.dms[message.channelID].owner;
    if (owner !== authUserId.uId) {
      throw HTTPError(403, 'Invalid permissions');
    }
  }

  if (message.isPinned === true) {
    throw HTTPError(400, 'Inavlid Message');
  }

  data[dataType][message.channelID].messages[message.index].isPinned = true;

  return {};
}

function messageUnpin(token: string, messageId: number) {
  const data = getData();

  if (validToken(token) === false) {
    throw HTTPError(403, 'Inavlid user token');
  }

  if (validMessage(messageId) === false) {
    throw HTTPError(400, 'Inavlid Message');
  }

  const dataType = getMessageType(messageId);
  const message = findMessage(messageId);
  const authUserId = findUser(token);

  // Only owner can pin messages
  if (dataType === 'channels') {
    const owners = data.channels[message.channelID].ownerMembers;
    if (owners.includes(authUserId.uId) === false) {
      throw HTTPError(403, 'Invalid permissions');
    }
  } else {
    const owner = data.dms[message.channelID].owner;
    if (owner !== authUserId.uId) {
      throw HTTPError(403, 'Invalid permissions');
    }
  }

  if (message.isPinned === false) {
    throw HTTPError(400, 'Inavlid Message');
  }

  data[dataType][message.channelID].messages[message.index].isPinned = false;
  console.log(data[dataType][message.channelID].messages);
  return {};
}

function messageSendLater(token: string, channelId: number, message: string, timeSent: number) {
  const data = getData();

  // invalid token
  if (validToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  const currentUser = findUser(token);
  // check channelid is valid
  const isValidChannel = data.channels.find(c => c.channelId === channelId);
  if (isValidChannel === undefined) {
    throw HTTPError(400, 'invalid channel');
  }

  // check authuserid is a member of the channel
  const checkIsMember = data.channels[channelId].allMembers;
  const isValidMember = checkIsMember.find(a => a === currentUser.uId);
  if (isValidMember === undefined) {
    throw HTTPError(403, 'not a member of the channel');
  }

  // Check length of message
  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'length of message is less than 1 or over 1000 characters');
  }

  // Check if timeSent is a time in the past
  const time = Math.floor(Date.now() / 1000);
  if (time > timeSent) {
    throw HTTPError(400, 'timeSent is a time in the past');
  }

  // Send a message at the specified time
  const messageId = 0;

  return { messageId };
}

export { messageUnpin, messagePin, messageUnReact, messageReact, messageSendV1, messageEditV1, messageRemoveV1, messageSendLater, resetId };
