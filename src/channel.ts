import { getData, setData } from './dataStore';
import { findUser, validToken, validUId } from './helperfunctions';

interface user {
  uId: number
  email: string
  nameFirst: string,
  nameLast: string,
  handleStr: string
}

/**
 * Given a channel with ID channelId that the authorised user
 * is a member of, provides basic details about the channel.
 *
 * @param {String} token
 * @param {Number} channelId
 * @returns {Object} channel
 */
function channelDetailsV1 (token: string, channelId: number): object {
  const data = getData();

  // invalid channelId error
  if (data.channels[channelId] === undefined) {
    return {
      error: 'Invalid channel'
    };
  }
  
  // invalid token error 
  if (validToken(token) === false) {
    return {
      error: 'Invalid token'
    };
  }

  // not a member error
  const currentUser = findUser(token);
  const isMember = data.channels[channelId].allMembers.find(a => a === currentUser.uId)
  if (isMember === undefined) {
    return {
      error: 'User is not a member of the channel'
    };
  }

  const ownerMembers:Array<number> = data.channels[channelId].ownerMembers;
  const allMembers:Array<number> = data.channels[channelId].allMembers;
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
 * @param {Number} authUserId - the id of the user joining the channel
 * @param {Number} channelId - the id of the course the user is trying to join
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
  data.channels[channelId].allMembers.push(currentUser.uId);
  setData(data);

  return {};
}

/**
 * Given a channel with channelId that the authorised user
 * can join, adds them to the allMembers array.
 *
 * @param {Number} authUserId - the id of the user creating the invite
 * @param {Number} channelId - the id of the course the user is trying to join
 * @param {Number} uId - the id of the user being invited to the channel
 * @returns {} - empty object
 */
function channelInviteV1(token: string, channelId: number, uId: number) {
  const data = getData();

  // invalid token error
  if (!validToken(token)) {
    return {
      error: 'Invalid token',
    };
  }

  const currentUser = findUser(token);
  // invalid uid to invite error
  if (!validUId(uId)) {
    return {
      error: 'invalid user',
    };
  }

  // invalid channel id error
  const isValidChannel = data.channels.find(a => a.channelId === channelId);
  if (isValidChannel === undefined) {
    return {
      error: 'Invalid channel',
    };
  }

  // check authuser is a member of the channel
  const checkIsMember = data.channels[channelId].allMembers;
  const isValidMember = checkIsMember.find(a => a === currentUser.uId);
  if (isValidMember === undefined) {
    return {
      error: 'You are not a member of this channel',
    };
  }

  // check member to invite is not already a member
  for (const element of data.channels[channelId].allMembers) {
    if (element === uId) {
      return {
        error: 'You are already a member',
      };
    }
  }

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
 * @param {Number} authUserId - the id of the person checking the message history
 * @param {Number} channelId - the id of the channel that the messages are in
 * @param {Number} start - the index of the message at which the message history is being determined from
 * @returns {Array} messages - returns an array of messages either empty or with messages
 * @returns {Number} start - returns the start value passed in
 * @returns {Number} end - returns -1 indicating no more messages after this return
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
        messagesArray = messages.slice(start,end);
      } else if (start + 50 >= numberOfMessages) {
        // If there is < 50 messages left in the channel history, end pagination
        messagesArray = messages.slice(start);
        end = -1;
      }
    return {
      messages: [messages],
      start: start,
      end: end,
    };
  }
  
}

function channelLeaveV1(token: string, channelId: number) {
  const data = getData();

  if (data.channels[channelId] === undefined) {
    return {
      error: 'Invalid channelId entered'
    };
  }

  if (!validToken(token)) {
    return {
      error: 'Invalid token entered'
    };
  }

  const user = findUser(token);
  if (!data.channels[channelId].allMembers.includes(user.uId)) {
    return {
      error: 'User is not a part of the channel'
    };
  } else {
    const Index = data.channels[channelId].allMembers.indexOf(user.uId);
    data.channels[channelId].allMembers.splice(Index, 1);
    setData(data);
    return {}
  }
}

function channelAddOwnerV1(token: string, channelId: number, uId: number) {
  return{};
}

function channelRemoveOwnerV1(token: string, channelId: number, uId: number) {
  return {};
}

export { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1, channelLeaveV1, channelAddOwnerV1, channelRemoveOwnerV1 };
