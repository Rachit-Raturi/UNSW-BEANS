import { getData, setData } from './dataStore';

/**
 * Given a channel with ID channelId that the authorised user
 * is a member of, provides basic details about the channel.
 *
 * @param {string} token
 * @param {number} channelId
 * @param {string} message
 * @returns {number} messageId
 */

function messageSend(token: string, channelId: number, message: string) {
  const data = getData();
  if (data.channels[channelId] === undefined) {
    return { error: `channelId(${channelId}) does not refer to a valid channel` };
  }

  if (message.length < 1 || message.length > 1000) {
    return { error: `message length(${message.length}) is too long or too short` };
  }

  const user = data.users.find(a => a.token === token);
  const checkIsMember = data.channels[channelId].allMembers;

  if (!checkIsMember.includes(user.uId)) {
    return { error: `user(${token}) is not a member of channel(${channelId})` };
  }

  if (user.token === undefined) {
    return { error: `token(${token}) does not refer to a valid user` };
  }

  const messageId = (new Date()).getTime() + Math.round(Math.random());
  const time = Math.floor(Date.now() / 1000);

  const newMessage = {
    messageId: messageId,
    uId: user.uId,
    message: message,
    timeSent: time

  };
  data.channels[channelId].messages.push(newMessage);
  setData(data);

  return messageId;
}

export { messageSend };
