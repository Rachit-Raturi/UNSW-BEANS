import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { getData, setData } from './dataStore';
import {findUser, validToken} from './helperfunctions'

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

export { messageSend };
