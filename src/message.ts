import { getData, setData } from './dataStore';
import {
  findUser,
  validToken,
  findMessage,
  validMessage,
  userStatsChanges,
  workplaceStatsChanges,
  getMessageType,
  dupeReact,
  sleep
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

  if (data.channels[channelId] === undefined) {
    return { error: `channelId(${channelId}) does not refer to a valid channel` };
  }

  if (message.length < 1 || message.length > 1000) {
    return { error: `message length(${message.length}) is too long or too short` };
  }

  if (validToken(token) === false) {
    return { error: `token(${token}) does not refer to a valid user` };
  }
  const user = findUser(token);
  const checkIsMember = data.channels[channelId].allMembers;
  if (checkIsMember.includes(user.uId) === false) {
    return { error: `user(${token}) is not a member of channel(${channelId})` };
  }

  const time = Math.floor(Date.now() / 1000);

  const newMessage = {
    messageId: Id,
    uId: user.uId,
    message: message,
    timeSent: time,
    reacts: []
  };

  userStatsChanges('messages', user.index, 'add');
  workplaceStatsChanges('messages', 'add');
  data.channels[channelId].messages.push(newMessage);
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

  if (message.length > 1000) {
    return { error: 'Message exceeds 1000 characters' };
  }

  if (validMessage(messageId) === false) {
    return { error: `message(${messageId}) does not refer to a valid message` };
  }

  if (validToken(token) === false) {
    return { error: `token(${token}) does not refer to a valid user` };
  }

  // Owner can edit the message but members cannot
  const messageObject = findMessage(messageId);
  const user = findUser(token);
  if (messageId % 2 === 0) {
    const owner = data.channels[messageObject.channelID].ownerMembers;
    if (user.uId !== messageObject.uId && owner.includes(user.uId) === false) {
      return { error: `user(${user.uId}) is not a member of channel(${messageId})` };
    }

    data.channels[messageObject.channelID].messages
      .find(m => m.messageId === messageObject.messageId).message = message;
  } else {
    const owner = data.dms[messageObject.channelID].owner;
    if (user.uId !== messageObject.uId && owner !== user.uId) {
      return { error: `user(${user.uId}) is not a member of channel(${messageId})` };
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
    return { error: `token(${token}) does not refer to a valid user` };
  }

  if (validMessage(messageId) === false) {
    return { error: `message(${messageId}) does not refer to a valid message` };
  }

  const user = findUser(token);
  const messageObject = findMessage(messageId);

  if (messageId % 2 === 0) {
    const member = data.channels[messageObject.channelID].allMembers;
    const owner = data.channels[messageObject.channelID].ownerMembers;
    // user is not a member of this channel
    if (member.includes(user.uId) === false) {
      return { error: `user(${user.uId}) is not a member of channel(${messageId})` };
    }

    if (messageObject.uId !== user.uId && (owner.includes(user.uId) === false)) {
      return { error: `user(${user.uId}) is not the sender or owner of the channel(${messageId})` };
    }
    data.channels[messageObject.channelID].messages.splice(messageObject.index, 1);
  } else {
    const member = data.dms[messageObject.channelID].members;
    const owner = data.dms[messageObject.channelID].owner;
    if (member.includes(user.uId) === false) {
      return { error: `user(${user.uId}) is not a member of dm(${messageId})` };
    }

    if (messageObject.uId !== user.uId && (owner !== user.uId)) {
      return { error: `user(${user.uId}) is not the sender or owner of the dm(${messageId})` };
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

  if (validMessage(messageId) === false) {
    return { error: 'Invalid messageId ASS' };
  }

  const dataType = getMessageType(messageId);
  const message = findMessage(messageId);
  const members = data[dataType][message.channelID].allMembers;
  const authUserId = findUser(token);

  if (members.includes(authUserId.uId) === false) {
    return { error: 'user does not have permissions to react' };
  }

  if (reactId !== 1) {
    return { error: 'invalid reactId' };
  }

  if (dupeReact(authUserId.uId, messageId, message.index, message.channelID)) {
    return { error: 'User has already reacted' };
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

async function messageSendLaterV1(token: string, channelId: number, message: string, timeSent: number) {
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

  // Check length of message
  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'length of message is less than 1 or over 1000 characters');
  }

  // check authuserid is a member of the channel
  const checkIsMember = data.channels[channelId].allMembers;
  const isValidMember = checkIsMember.find(a => a === currentUser.uId);
  if (isValidMember === undefined) {
    throw HTTPError(403, 'not a member of the channel');
  }

  // Check if timeSent is a time in the past
  const time = Math.floor(Date.now() / 1000);
  if (time > timeSent) {
    throw HTTPError(400, 'timeSent is a time in the past');
  }

  // Send a message at the specified time
  const wait = timeSent - time;
  await sleep(wait);
  const newMessage = {
    messageId: Id,
    uId: currentUser.uId,
    message: message,
    timeSent: timeSent,
    reacts: []
  };

  userStatsChanges('messages', user.index, 'add');
  workplaceStatsChanges('messages', 'add');
  data.channels[channelId].messages.push(newMessage);
  setData(data);

  Id = Id + 2;
  return { messageId: Id - 2 };
}

function messageUnReact(token: string, messageId: number, reactId: number) {
  const data = getData();

  if (validMessage(messageId) === false) {
    return { error: 'Invalid messageId ' };
  }

  const dataType = getMessageType(messageId);
  const message = findMessage(messageId);
  const members = data[dataType][message.channelID].allMembers;
  const authUserId = findUser(token);

  if (members.includes(authUserId.uId) === false) {
    return { error: 'user does not have permissions to react' };
  }

  if (reactId !== 1) {
    return { error: 'invalid reactId' };
  }

  if (message.reacts.length === 0) {
    return { error: 'react undefined' };
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
export { messageUnReact, messageReact, messageSendV1, messageEditV1, messageRemoveV1, resetId, messageSendLaterV1 };
