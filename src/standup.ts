import { getData, setData } from './dataStore';
import { findUser, validToken } from './helperfunctions';
import { messageSendV1 } from './message';
import HTTPError from 'http-errors';

/**
 * For a given channel, starts a standup period lasting length seconds.
 *
 * During this standup period, if someone calls standup/send with a message,
 * it will be buffered during the length-second window. Then, at the end of
 * the standup, all buffered messages are packaged into one message, and this
 * packaged message is sent to the channel from the user who started the
 * standup. If no standup messages are sent during the standup, no message
 * should be sent at the end.
 *
 * @param {String} token
 * @param {Number} channelId
 * @param {Number} length
 * @returns {Number} timeFinish
 */
function standupStartV1 (token: string, channelId: number, length: number): {timeFinish: number} {
  const data = getData();

  // Invalid token error
  if (validToken(token) === false) {
    throw HTTPError(403, 'Invalid token');
  }

  // Invalid channelId error
  if (data.channels[channelId] === undefined) {
    throw HTTPError(400, 'Invalid channelId');
  }

  // Not a member error
  const currentUser = findUser(token);
  const isMember = data.channels[channelId].allMembers.find(a => a === currentUser.uId);

  if (isMember === undefined) {
    throw HTTPError(403, 'User is not a member of the channel');
  }

  // Invalid length error
  if (length < 0) {
    throw HTTPError(400, 'Invalid length');
  }

  // Already has an active standup running error
  const currentStandup = data.channels[channelId].standup;
  if (currentStandup.isActive === true) {
    throw HTTPError(400, 'An active standup is already currently running in the channel');
  }

  currentStandup.isActive = true;
  currentStandup.timeFinish = Math.floor(Date.now() / 1000) + length + 2; // allows for 2 second delay
  currentStandup.messages = '';
  data.channels[channelId].standup = currentStandup;
  setData(data);

  return {
    timeFinish: currentStandup.timeFinish,
  };
}

/**
 * For a given channel, returns whether a standup is active in it, and what time the standup finishes.
 * If no standup is active, then timeFinish should be null.
 *
 * @param {String} token
 * @param {Number} channelId
 * @returns {Object} isActive, timeFinish
 */
function standupActiveV1 (token: string, channelId: number): object {
  const data = getData();

  // Invalid token error
  if (validToken(token) === false) {
    throw HTTPError(403, 'Invalid token');
  }

  // Invalid channelId error
  if (data.channels[channelId] === undefined) {
    throw HTTPError(400, 'Invalid channelId');
  }

  // Not a member error
  const currentUser = findUser(token);
  const isMember = data.channels[channelId].allMembers.find(a => a === currentUser.uId);
  if (isMember === undefined) {
    throw HTTPError(403, 'User is not a member of the channel');
  }

  const currentStandup = data.channels[channelId].standup;
  if (Math.floor(Date.now() / 1000) >= currentStandup.timeFinish && currentStandup.timeFinish !== null) {
    messageSendV1(token, channelId, currentStandup.messages);
    currentStandup.isActive = false;
    currentStandup.timeFinish = null;
    currentStandup.messages = '';
  }

  data.channels[channelId].standup = currentStandup;

  return {
    isActive: currentStandup.isActive,
    timeFinish: currentStandup.timeFinish
  };
}

/**
 * For a given channel, if a standup is currently active in the channel,
 * sends a message to get buffered in the standup queue.
 * Note: @ tags should not be parsed as proper tags (i.e.
 * no notification should be triggered on send, or when the standup finishes).
 *
 * @param {String} token
 * @param {Number} channelId
 * @param {String} message
 * @returns {}
 */
function standupSendV1 (token: string, channelId: number, message: string) {
  const data = getData();

  // Invalid token error
  if (validToken(token) === false) {
    throw HTTPError(403, 'Invalid token');
  }

  // Invalid channelId error
  if (data.channels[channelId] === undefined) {
    throw HTTPError(400, 'Invalid channelId');
  }

  // Not a member error
  const currentUser = findUser(token);
  const isMember = data.channels[channelId].allMembers.find(a => a === currentUser.uId);
  if (isMember === undefined) {
    throw HTTPError(403, 'User is not a member of the channel');
  }

  // No active standup running error
  const currentStandup = data.channels[channelId].standup;
  if (currentStandup.isActive === false) {
    throw HTTPError(400, 'No active standup is running in the channel');
  }

  if (currentStandup.messages === '') {
    currentStandup.messages = message;
  } else {
    currentStandup.messages += '\n' + message;
  }
  data.channels[channelId].standup.messages = currentStandup.messages
  setData(data);
  return {};
}

export { standupStartV1, standupActiveV1, standupSendV1 };
