import { getData, setData } from './dataStore';

/**
 * Given a channel with ID channelId that the authorised user
 * is a member of, provides basic details about the channel.
 *
 * @param {Number} authUserId
 * @param {Number} channelId
 * @returns {Object} channel
 */
function channelDetailsV1 (authUserId, channelId) {
  const data = getData();

  // invalid channelId error
  if (data.channels[channelId] === undefined) {
    return {
      error: 'Invalid channel'
    };
  }

  // not a member error
  const checkIsMember = data.channels[channelId].allMembers;
  const isValidMember = checkIsMember.find(a => a === authUserId);
  if (isValidMember === undefined) {
    return {
      error: 'Invalid authUser',
    };
  }

  // invalid userId error
  if (data.users[authUserId] === undefined) {
    return {
      error: 'Invalid user'
    };
  }

  const owners = data.channels[channelId].ownerMembers;
  const members = data.channels[channelId].allMembers;
  const ownersArray = [];
  const membersArray = [];

  // Create ownerMembers array output
  for (const element of owners) {
    ownersArray.push({
      uId: data.users[element].uId,
      email: data.users[element].email,
      nameFirst: data.users[element].nameFirst,
      nameLast: data.users[element].nameLast,
      handleStr: data.users[element].handleStr,
    });
  }

  // Create allMembers array output
  for (const element of members) {
    membersArray.push({
      uId: data.users[element].uId,
      email: data.users[element].email,
      nameFirst: data.users[element].nameFirst,
      nameLast: data.users[element].nameLast,
      handleStr: data.users[element].handleStr,
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
function channelJoinV1(authUserId, channelId) {
  const data = getData();

  // invalid authuserId
  const isValidAuthUser = data.users.find(a => a.uId === authUserId);
  if (isValidAuthUser === undefined) {
    return {
      error: 'Invalid user',
    };
  }

  // invalid channelId error
  if (data.channels[channelId] === undefined) {
    return {
      error: 'Invalid channel'
    };
  }

  // already member error
  if (data.channels[channelId].allMembers.includes(authUserId)) {
    return {
      error: 'User is already a member of this channel'
    };
  }

  // private channel error
  if (data.channels[channelId].isPublic === false) {
    // global owner false
    if (authUserId > 0) {
      return {
        error: `User(${authUserId}) cannot join a private channel`
      };
    }
  }

  // add member to channel
  data.channels[channelId].allMembers.push(authUserId);
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
function channelInviteV1(authUserId, channelId, uId) {
  const data = getData();

  // invalid authuserid error
  const isValidAuthUser = data.users.find(a => a.uId === authUserId);
  if (isValidAuthUser === undefined) {
    return {
      error: 'Invalid user',
    };
  }

  // invalid uid to invite error
  const isvaliduId = data.users.find(a => a.uId === uId);
  if (isvaliduId === undefined) {
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
  const isValidMember = checkIsMember.find(a => a === authUserId);
  if (isValidMember === undefined) {
    return {
      error: 'Invalid authuser',
    };
  }

  // check member to invite is not already a member
  for (const element of data.channels[channelId].allMembers) {
    if (element === uId) {
      return {
        error: 'Already a member',
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

function channelMessagesV1(authUserId, channelId, start) {
  const data = getData();
  const beginning = start;
  // check authuserid is valid
  const isValiduser = data.users.find(a => a.uId === authUserId);
  if (isValiduser === undefined) {
    return {
      error: 'Invalid user',
    };
  }

  // check channelid is valid
  const isValidChannel = data.channels.find(c => c.channelId === channelId);
  if (isValidChannel === undefined) {
    return {
      error: 'Invalid channel',
    };
  }

  // check authuserid is a member of the channel
  const checkIsMember = data.channels[channelId].allMembers;
  const isValidMember = checkIsMember.find(a => a === authUserId);
  if (isValidMember === undefined) {
    return {
      error: `The authorised user ${authUserId} is not a member of the channel ${channelId}`,
    };
  }

  const numberOfMessages = data.messages.length;
  const messages = data.messages;
  let end;
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
    while (start < numberOfMessages) {
      // If starting index is 0 or a multiple of 50
      if (start % 50 === 0 && start < numberOfMessages) {
        end = start + 50;
        console.log(`{ [messages], ${start}, ${end} }`);
        start += 50;
      } else if (start % 50 !== 0 && start < numberOfMessages) {
        // If starting index is not a multiple of 50
        end = start / 50 * 50 + 50; // e.g start = 120 -> 120 / 50 * 50 + 50 = 150
        console.log(`{ [messages], ${start}, ${end} }`);
        start = end;
      } else if (start + 50 >= numberOfMessages) {
        // If there is < 50 messages left in the channel history, end pagination
        end = -1;
        console.log(`{ [messages], ${start}, ${end} }`);
        start = beginning;
        return {
          messages: [messages],
          start: start,
          end: end,
        };
      }
    }
  }
}

export { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1 };
