import { getData, setData } from './dataStore';
import { findUser, validToken, findMessage, validMessage } from './helperfunctions';

/**
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
    timeSent: time

  };

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
  const owner = data.channels[messageObject.channelID].ownerMembers;

  if (user.uId !== messageObject.uId && owner.includes(user.uId) === false) {
    return { error: `user(${user.uId}) is not a member of channel(${messageId})` };
  }

  data.channels[messageObject.channelID].messages
    .find(m => m.messageId === messageObject.messageId).message = message;

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
  return {};
}

let messageId = 1;
function messageSendDmV1(token: string, dmId: number, message: string) {
  const data = getData();

  // Check for valid token
  if (validToken(token) === false) {
    return {
      error: 'Invalid token'
    };
  }

  // Check for valid dmId
  const isValidDm = data.dms.find(d => d.dmId === dmId);
  if (isValidDm === undefined) {
    return {
      error: 'Invalid dm'
    };
  }

  const user = findUser(token);
  const checkIsMember = data.dms[dmId].members;
  if (checkIsMember.includes(user.uId) === false || data.dms[dmId].owner !== user.uId) {
    return {
      error: `user(${token}) is not a member of dm(${dmId})`
    };
  }

  // Check length of message
  if (message.length < 1 || message.length > 1000) {
    return {
      error: `message length(${message.length}) is too long or too short`
    };
  }

  const time = Math.floor(Date.now() / 1000); 
  let maxMessageId = data.dms[dmId].messages.length;
  console.log(maxMessageId)
  let messageId = maxMessageId + 1;

  const newMessage = {
    messageId: messageId,
    uId: user.uId,
    message: message,
    timeSent: time,
  };

  data.dms[dmId].messages.push(newMessage);
  setData(data);

  messageId = messageId + 2;

  return {
    messageId: messageId - 2
  };
}

export { messageSendV1, messageEditV1, messageRemoveV1, messageSendDmV1, resetId };
