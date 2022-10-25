import { getData, setData } from './dataStore';
import { findUser, validToken, extractUser } from './helperfunctions';

/**
 * Given a valid authUserId and channel name, creates and
 * returns a new channel with its details
 *
 * @param {Number} authUserId
 * @param {String} name
 * @param {Boolean} isPublic
 * @returns {Object} channel
 */

function channelsCreateV1(token: string, name: string, isPublic: boolean) {
  const data = getData();

  
  if (!validToken(token)) {
    return {
      error: 'Invalid user'
    };
  }

  // name length invalid - between 1 and 20 (inclusive)
  if (name.length < 1 || name.length > 20) {
    return {
      error: 'Name is not between 1 and 20 characters inclusive'
    };
  }

  const members = [];
  const owners = [];

  let user = findUser(token);
  owners.push(user.uId);
  members.push(user.uId);

  const channel = {
    channelId: data.channels.length,
    name: name,
    isPublic: isPublic,
    ownerMembers: owners,
    allMembers: members,
    messages: [],
  };

  data.channels.push(channel);
  setData(data);

  return {
    channelId: data.channels.length - 1,
  };
}

/**
  * Given a valid authUserId will return a list
  * of all the public channels the user is in.
  *
  * @param {number} authUserId - The authUserId of the user
  * @returns {array} channels - list of channels
  * - returns array of public channels
*/
function channelsListV1(token: string) {
  const data = getData();
  // check authuser is valid
  if (validToken(token) === false) {
    return {
      error: 'Invalid token'
    };
  }
  
  const currentUser = findUser(token);
  const outputChannels = [];

  // create array of public channels
  for (const element of data.channels) {
    if (element.isPublic === true && (element.allMembers).includes(currentUser.uId)) {
      outputChannels.push({ channelId: element.channelId, name: element.name });
    }
  }

  return {
    channels: outputChannels,
  };
}

/**
  * Given a valid authUserId will return a list
  * of all channels the user is in.
  *
  * @param {number} authUserId - The authUserId of the user
  * @returns {array} channels - list of channels
  * - returns array of all channels
*/
function channelsListAllV1(token: string) {
  const data = getData();

  // check authuser is valid
  if (!validToken(token)) {
    return {
      error: 'authUserId does not refer to a valid ID'
    };
  }

  const allChannelsArray = data.channels;
  const outputChannels = [];

  let user = findUser(token);
  // create array of channels the user is in
  for (const element of allChannelsArray) {
    if ((element.allMembers).includes(user.uId)) {
      outputChannels.push({ channelId: element.channelId, name: element.name });
    }
  }

  return {
    channels: outputChannels,
  };
}

export { channelsCreateV1, channelsListV1, channelsListAllV1 };
