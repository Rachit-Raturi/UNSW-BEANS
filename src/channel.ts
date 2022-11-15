import { getData, setData } from './dataStore';
import { findUser, validToken, validUId, userStatsChanges } from './helperfunctions';
import HTTPError from 'http-errors';

interface user {
  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string
}

/**
 * Given a channel with ID channelId that the authorised user
 * is a member of, provides basic details about the channel.
 *
 * @param {string} token
 * @param {number} channelId
 * @returns {object} channel
 */
function channelDetailsV1 (token: string, channelId: number): object {
  const data = getData();

  // invalid channelId error
  if (data.channels[channelId] === undefined) {
    throw HTTPError(400, 'Invalid channelId');
  }

  // invalid token error
  if (validToken(token) === false) {
    throw HTTPError(403, 'Invalid token');
  }

  // not a member error
  const currentUser = findUser(token);
  const isMember = data.channels[channelId].allMembers.find(a => a === currentUser.uId);
  if (isMember === undefined) {
    throw HTTPError(403, 'User is not a member of the channel');
  }

  const ownerMembers: Array<number> = data.channels[channelId].ownerMembers;
  const allMembers: Array<number> = data.channels[channelId].allMembers;
  const ownersArray: Array<user> = [];
  const membersArray: Array<user> = [];

  // Create ownerMembers array output
  for (const owner of ownerMembers) {
    ownersArray.push({
      uId: data.users[owner].uId,
      email: data.users[owner].email,
      nameFirst: data.users[owner].nameFirst,
      nameLast: data.users[owner].nameLast,
      handleStr: data.users[owner].handleStr,
    });
  }

  // Create allMembers array output
  for (const member of allMembers) {
    membersArray.push({
      uId: data.users[member].uId,
      email: data.users[member].email,
      nameFirst: data.users[member].nameFirst,
      nameLast: data.users[member].nameLast,
      handleStr: data.users[member].handleStr,
    });
  }

  return {
    name: data.channels[channelId].name,
    isPublic: data.channels[channelId].isPublic,
    ownerMembers: ownersArray,
    allMembers: membersArray,
  };
}

/**
 * Given a channel with channelId that the authorised user
 * can join, adds them to the allMembers array.
 *
 * @param {number} authUserId - the id of the user joining the channel
 * @param {number} channelId - the id of the course the user is trying to join
 * @returns {} - empty object
 */
function channelJoinV1(token: string, channelId: number) {
  const data = getData();

  // invalid token
  if (!validToken(token)) {
    return {
      error: 'Invalid user'
    };
  }

  const currentUser = findUser(token);
  // invalid channelId error
  if (data.channels[channelId] === undefined) {
    return {
      error: 'Invalid channel'
    };
  }

  // already member error
  if (data.channels[channelId].allMembers.includes(currentUser.uId)) {
    return {
      error: 'User is already a member of this channel'
    };
  }

  // private channel error
  if (data.channels[channelId].isPublic === false) {
    // global owner false
    if (currentUser.uId > 0) {
      return {
        error: `User(${currentUser.uId}) cannot join a private channel`
      };
    }
  }

  // add member to channel
  console.log('join');
  data.channels[channelId].allMembers.push(currentUser.uId);
  userStatsChanges('channels', currentUser.index, 'add');
  setData(data);

  return {};
}

/**
 * Given a channel with channelId that the authorised user
 * can join, adds them to the allMembers array.
 *
 * @param {number} authUserId - the id of the user creating the invite
 * @param {number} channelId - the id of the course the user is trying to join
 * @param {number} uId - the id of the user being invited to the channel
 * @returns {} - empty object
 */
function channelInviteV1(token: string, channelId: number, uId: number) {
  const data = getData();

  // invalid token error
  if (!validToken(token)) {
    throw HTTPError(403, 'invalid token');
  }

  const currentUser = findUser(token);
  // invalid uid to invite error
  if (!validUId(uId)) {
    throw HTTPError(400, 'invalid user');
  }

  // invalid channel id error
  const isValidChannel = data.channels.find(a => a.channelId === channelId);
  if (isValidChannel === undefined) {
    throw HTTPError(400, 'invalid channel');
  }

  // check authuser is a member of the channel
  const checkIsMember = data.channels[channelId].allMembers;
  const isValidMember = checkIsMember.find(a => a === currentUser.uId);
  if (isValidMember === undefined) {
    throw HTTPError(403, 'not a member of the channel');
  }

  // check member to invite is not already a member
  for (const element of data.channels[channelId].allMembers) {
    if (element === uId) {
      throw HTTPError(400, 'user is already a member');
    }
  }

  let uIdindex;
  for (const user of data.users) {
    if (user.uId === uId) {
      uIdindex = (data.users).indexOf(user);
    }
  }

  userStatsChanges('channels', uIdindex, 'add');
  console.log('invite');
  // add uid to members
  const membersArray = data.channels[channelId].allMembers;
  membersArray.push(uId);
  data.channels[channelId].allMembers = membersArray;
  setData(data);
  return {};
}

/**
 * Given a channel that the authorised user is apart of
 * checks the channels message history given a starting index
 * where the most recent message has an index of 0
 *
 * @param {number} authUserId - the id of the person checking the message history
 * @param {number} channelId - the id of the channel that the messages are in
 * @param {number} start - the index of the message at which the message history is being determined from
 * @returns {array} messages - returns an array of messages either empty or with messages
 * @returns {number} start - returns the start value passed in
 * @returns {number} end - returns -1 indicating no more messages after this return
 */

function channelMessagesV1(token: string, channelId: number, start: number): object {
  const data = getData();

  // invalid token
  if (validToken(token) === false) {
    return {
      error: 'Invalid token',
    };
  }

  const currentUser = findUser(token);
  // check channelid is valid
  const isValidChannel = data.channels.find(c => c.channelId === channelId);
  if (isValidChannel === undefined) {
    return {
      error: 'Invalid channel',
    };
  }

  // check authuserid is a member of the channel
  const checkIsMember = data.channels[channelId].allMembers;
  const isValidMember = checkIsMember.find(a => a === currentUser.uId);
  if (isValidMember === undefined) {
    return {
      error: `The authorised user ${currentUser.uId} is not a member of the channel ${channelId}`,
    };
  }

  const numberOfMessages = data.channels[channelId].messages.length;
  const messages = data.channels[channelId].messages;
  let end: number;
  let messagesArray;
  // Check whether the starting index is < 0
  if (start < 0) {
    return {
      error: 'Index cannot be negative as there are no messages after the most recent message',
    };
  } else if (start === numberOfMessages || numberOfMessages === undefined) {
    /* If there are no messages in the channel or if the starting index is = number of messages
       If start = messages in channel return empty array -> earliest message (i.e highest index) is
       number of messages - 1, no messages in history from that index
    */
    return {
      messages: [],
      start: start,
      end: -1,
    };
  } else if (start >= 0 && start > numberOfMessages) {
    // If starting index is greater than the number of messages sent in the channel
    return {
      error: `The starting index, ${start}, is greater than the number of messages in the channel, ${numberOfMessages}`
    };
  } else if (start >= 0 && start < numberOfMessages) {
    // If starting index is 0 or a multiple of 50
    if (start + 50 < numberOfMessages) {
      end = start + 50;
      messagesArray = messages.slice(start, end);
    } else if (start + 50 >= numberOfMessages) {
      // If there is < 50 messages left in the channel history, end pagination
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
 * Given a channel that the authorised user is apart of
 * removes the user from the channel
 *
 * @param {string} token - the token of relating to the session where the user is leaving the channel
 * @param {number} channelId - the id of the channel that the user intends to leave
 */

function channelLeaveV1(token: string, channelId: number) {
  const data = getData();
  // check validity of channelId
  if (data.channels[channelId] === undefined) {
    throw HTTPError(400, 'Invalid channelId entered');
  }

  // check validity of token
  if (!validToken(token)) {
    throw HTTPError(403, 'Invalid token entered');
  }

  // check if the user is a member of the channel
  const user = findUser(token);
  if (!data.channels[channelId].allMembers.includes(user.uId)) {
    throw HTTPError(403, 'User is not a part of the channel');
  } else {
    const Index = data.channels[channelId].allMembers.indexOf(user.uId);
    data.channels[channelId].allMembers.splice(Index, 1);

    // check if the user is also an owner
    if (data.channels[channelId].ownerMembers.includes(user.uId)) {
      const Index2 = data.channels[channelId].ownerMembers.indexOf(user.uId);
      data.channels[channelId].ownerMembers.splice(Index2, 1);
    }

    userStatsChanges('channels', user.index, 'remove');
    console.log('remove');
    setData(data);
    return {};
  }
}

/**
 * Given a channel that the authorised user is apart of
 * promotes a member of the channel to an owner
 *
 * @param {string} token - the token of relating to the session where the the user wants to add
 ************************** another owner to the channel
 * @param {number} channelId - the id of the channel that the user intends to add an owner to
 * @param {number} uId - the user id of the user being promoted
 */

function channelAddOwnerV1(token: string, channelId: number, uId: number) {
  const data = getData();

  if (data.channels[channelId] === undefined) {
    throw HTTPError(400, 'Invalid channelId entered');
  }

  if (!validToken(token)) {
    throw HTTPError(403, 'Invalid token entered');
  }

  if (!validUId(uId)) {
    throw HTTPError(400, 'Invalid uId entered');
  }

  if (!data.channels[channelId].allMembers.includes(uId)) {
    throw HTTPError(400, 'UId refers to someone who is not a member of the channel');
  }

  if (data.channels[channelId].ownerMembers.includes(uId)) {
    throw HTTPError(400, 'UId refers to someone who is already an owner of the channel');
  }

  const user = findUser(token);
  if (user.uId === 0 || data.channels[channelId].ownerMembers.includes(user.uId)) {
    data.channels[channelId].ownerMembers.push(uId);
    setData(data);
    return {};
  } else {
    throw HTTPError(403, 'User does not possess the correct permissions');
  }
}

/**
 * Given a channel that the authorised user is apart of
 * removes a user as an owner of the channel
 *
 * @param {string} token - the token  relating to the session where the the user wants to remove
 ************************** another owner from a channel
 * @param {number} channelId - the id of the channel that the user intends to remove an owner from
 * @param {number} uId - the user id of the user being demoted
 */
function channelRemoveOwnerV1(token: string, channelId: number, uId: number) {
  const data = getData();

  if (data.channels[channelId] === undefined) {
    throw HTTPError(400, 'Invalid channelId entered');
  }

  if (!validToken(token)) {
    throw HTTPError(403, 'Invalid token entered');
  }

  if (!validUId(uId)) {
    throw HTTPError(400, 'Invalid uId entered');
  }

  if (!data.channels[channelId].ownerMembers.includes(uId)) {
    throw HTTPError(400, 'UId refers to someone who is not an owner of the channel');
  }

  if (data.channels[channelId].ownerMembers.includes(uId) && data.channels[channelId].ownerMembers.length === 1) {
    throw HTTPError(400, 'UId refers to the only owner of the channel');
  }

  const user = findUser(token);
  if (user.uId === 0 || data.channels[channelId].ownerMembers.includes(user.uId)) {
    const Index = data.channels[channelId].ownerMembers.indexOf(uId);
    data.channels[channelId].ownerMembers.splice(Index, 1);
    setData(data);
    return {};
  } else {
    throw HTTPError(403, 'User does not possess the correct permissions');
  }
}

export { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1, channelLeaveV1, channelAddOwnerV1, channelRemoveOwnerV1 };
