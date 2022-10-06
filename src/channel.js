import { getData, setData } from './dataStore.js';

/**
 * Given a channel with ID channelId that the authorised user
 * is a member of, provides basic details about the channel.
 * 
 * @param {Number} authUserId
 * @param {Number} channelId
 * @returns {Object} channel
 */
function channelDetailsV1 (authUserId, channelId) {
  let data = getData();

  // invalid channelId error 
  if (data.channels[channelId] === undefined) { 
    return {
      error: 'Invalid channel'
    };
  }

  // not a member error
  let checkismember = data.channels[channelId].allMembers
  let isvalidmember = checkismember.find(a => a === authUserId);
  if (isvalidmember === undefined) {
    return {
        error: "invalid authuser",
    };
  }

  // invalid userId error
  if (data.users[authUserId] === undefined) { 
    return {
      error: 'Invalid user'
    };
  }
  
  let owners = data.channels[channelId].ownerMembers
  let members = data.channels[channelId].allMembers
  let users = data.users;

  let ownersArray = [];
  let membersArray = [];

  for (const element of owners) {
    ownersArray.push({
      uId: data.users[element].uId,
      email: data.users[element].email,
      nameFirst: data.users[element].nameFirst,
      nameLast: data.users[element].nameLast,
      handleStr: data.users[element].handleStr,
    });
  }

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

function channelJoinV1( authUserId, channelId ) {
  let data = getData();

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
  data.channels[channelId].allMembers.push(authUserId); 
  setData(data); 

  return {};
}

function channelInviteV1( authUserId, channelId, uId ) { 
  const data = getData();

  const isValidAuthUser = data.users.find(a => a.uId === authUserId);
  if (isValidAuthUser === undefined) {
    return {
      error: 'Invalid user',
    };
  }

  const isvaliduId = data.users.find(a => a.uId === uId);
  if (isvaliduId === undefined) {
    return {
        error: "invalid user",
    };
  }



  const isValidChannel = data.channels.find(a => a.channelId === channelId);
  if (isValidChannel === undefined) {
    return {
        error: 'Invalid channel',
    };
  }

  let checkismember = data.channels[channelId].allMembers
  let isvalidmember = checkismember.find(a => a === authUserId);
  if (isvalidmember === undefined) {
    return {
        error: 'Invalid authuser',
    };
  }

  for (const element of data.channels[channelId].allMembers) {
    if (element === uId) {
      return {
        error: 'Already a member',
      };
    }
  }

  let membersArray = data.channels[channelId].allMembers;
    membersArray.push(uId);
  data.channels.allMembers = membersArray;
  return {};
}

function channelMessagesV1(authUserId, channelId, start) {
  const data = getData();
  const isValiduser = data.users.find(a => a.uId === authUserId);
  if (isValiduser === undefined) {
    return { 
      error: 'Invalid user',
    };
  }
  
  const isValidChannel = data.channels.find(c => c.channelId === channelId);
  if (isValidChannel === undefined) {
    return {
      error: 'Invalid channel',
    };
  }
  
  const members = channelDetailsV1(channelId).allMembers;
  for (let j = 0; j < members.length; j++) {
    if (members[j] === authUserId) {
      break;
    }
    if (j === members.length) {
      return {
        error: `The authorised user ${authUserId} is not a member of the channel`,
      };
    }
  }  
  
  const numberOfMessages = data.channels.messages.length; 
  const messages = data.channels.messages;
  let end;
  if (start < 0) {
    return {
      error: 'Index cannot be negative as there are no messages after the most recent message',
    };
  } else if (start === numberOfMessages) {
    return {
      messages: [],
      start: start,
      end: -1,
    };
  } else if (start >= 0 && start > numberOfMessages) {
    return {
      error: `The starting index, ${start}, is greater than the number of messages in the channel, ${numberOfMessages}`
    };
  } else if (start >= 0 && start < numberOfMessages) {
    while (start < numberOfMessages) {
      if (start % 50 === 0 && start < numberOfMessages) {
        end = start + 50;
        console.log(`{ [messages], ${start}, ${end} }`);
        start += 50;
      } else if (start % 50 !== 0 && start < numberOfMessages) {
        end = start / 50 * 50 + 50; // e.g start = 120 -> 120 / 50 * 50 + 50 = 150
        console.log(`{ [messages], ${start}, ${end} }`);
        start = end;
      } else if (start + 50 >= numberOfMessages) {
        end = -1;
        console.log(`{ [messages], ${start}, ${end} }`)
        return {
          messages: [messages],
          start: start,
          end: end,
        }
      }
    }
  }
}

export {channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1};