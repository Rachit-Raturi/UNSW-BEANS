import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { getData, setData } from './dataStore';
import {findUser, validToken, findMessage, validMessage} from './helperfunctions'

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

function messageSend(token: string, channelId: number, message: string) {
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
  let user = findUser(token); 
  const checkIsMember = data.channels[channelId].allMembers;
  if (checkIsMember.includes(user.uId) === false) {
    return { error: `user(${token}) is not a member of channel(${channelId})` };
  }

  const time = Math.floor(Date.now() / 1000);

  const newMessage = {
    messageId: Id,
    uId: 3,
    message: message,
    timeSent: time

  };

  data.channels[channelId].messages.push(newMessage);
  setData(data);

  Id = Id + 2; 
  return {messageId: Id - 2};
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
function messageEdit(token: string, messageId: number, message: string) {
  const data = getData();

  if (message.length > 1000) { 
    return {error: "Message exceeds 1000 characters"}
  }

  if (validMessage(messageId) === false) {
    return { error: `message(${messageId}) does not refer to a valid message` };
  }

  if (validToken(token) === false) {
    return { error: `token(${token}) does not refer to a valid user` };
  }
  
  // Owner can edit the message but members cannot
  let messageObject = findMessage(messageId); 
  let user = findUser(token); 
  const checkIsMember = data.channels[messageObject.channelID].ownerMembers;

  if (user.uId !== messageObject.uId && checkIsMember.includes(user.uId) === false) { 
    return { error: `user(${token}) is not a member of channel(${messageId})` };
  }

  data.channels[messageObject.channelID].messages.
  find( m => m.messageId === messageObject.messageId).message = message;
    
  return {}
}

export { messageSend, messageEdit, resetId };