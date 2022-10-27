import { getData, setData } from './dataStore';
import { findUser, validToken } from './helperfunctions';

interface dm {
  dmId: number,
  name: string
}

/**
 * Returns the list of DMs that the user is a member of.
 *
 * @param {String} token
 * @returns {Object} dms
 */
// function dmList (token: string): Array<dm> {
//   const data = getData();

//   // invalid token error
//   if (data.users[token] === undefined) {
//     return {
//       error: 'Invalid token'
//     };
//   }

//   return {};
// }

function dmCreateV1(token: string, uIds?: Array<number>) {
  const data = getData();

  // invalid token
  if (validToken(token) === false) {
    return {
      error: 'Invalid token'
    };
  }

  // invalid user Id
  for (const uId of uIds) {
    if (data.users[uId] === undefined) {
      return {
        error: `Invalid uId ${uId}`
      };
    }
  }

  // duplicate user Id
  function hasDuplicates(array) {
    return (new Set(array)).size === array.length;
  }
  
  if (!hasDuplicates(uIds)) {
    return {error: 'duplicate uIds entered'};
  }

  //owner in uIds
  const currentUser = findUser(token);
  for (const uId of uIds) {
    if (uId === currentUser.uId) {
      return { error: 'owner is part of uIds'};
    }
  }

  const ownerHandle: string = currentUser.handleStr;
  const authUserId: number = currentUser.uId;

  const name = [];
  name.push(ownerHandle);

  for (const element of uIds) {
    let userHandle = ', ' + data.users[element].handleStr;
    name.push(userHandle);
  }
  const membersArray = uIds;
  membersArray.push(currentUser.uId);

  const dm = {
    dmId: data.dms.length,
    name: name,
    owner: authUserId,
    members: membersArray,
    messages: [],
  };

  data.dms[data.dms.length] = dm;
  setData(data);

  return {
    dmId: data.dms.length - 1,
  };
}

function dmMessagesV1(token: string, dmId: number, start: number) {
  const data = getData();
  const beginning = start;
  
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

  const currentUser = findUser(token);
  const authUserId: number = currentUser.uId;

  // Check if user is a member of dm
  const checkIsMember = data.dms[dmId].members;
  if (checkIsMember.includes(authUserId) === false) {
    return {
      error: `user(${token}) is not a member of the dm(${dmId})`
    };
  }

  const messages = data.dms[dmId].messages;
  const numberOfMessages = messages.length;
  let end: number;
  let messagesArray;

  // Check whether starting index is < 0
  if (start < 0) {
    return {
      error: 'Index cannot be negative as there are no messages after the most recent message',
    };
  } else if (start === numberOfMessages || numberOfMessages === undefined) {
    return {
      messages: [],
      start: start,
      end: -1,
    };
  } else if (start >= 0 && start > numberOfMessages) {
    // If starting index is greater than the number of messages sent in the dm
    return {
      error: `The starting index, ${start}, is greater than the number of messages in the dm, ${numberOfMessages}`
    };
  } else if (start >= 0 && start < numberOfMessages) {
    // If starting index is 0 or a multiple of 50
    if (start + 50 < numberOfMessages) {
      end = start + 50;
      messagesArray = messages.slice(start,end);
    } else if (start + 50 >= numberOfMessages) {
      // If there is < 50 messages left in the dm history, end pagination
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

function dmListV1 (token: string) {
  return{};
}

function dmRemoveV1 (token: string, dmId: number) {
  return{};
}

function dmDetailsV1 (token: string, dmId: number) {
  return{};
}


function dmLeaveV1 (token: string, dmId: number) {
  return{};
}


export { dmCreateV1, dmMessagesV1, messageSendDmV1, dmListV1, dmRemoveV1, dmDetailsV1, dmLeaveV1 };