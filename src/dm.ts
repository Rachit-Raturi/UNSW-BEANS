import { getData, setData } from './dataStore';
import { findUser, validToken } from './helperfunctions';

interface dm {
  dmId: number,
  name: string
}

interface user {
  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string
}

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
    return { error: 'duplicate uIds entered' };
  }

  // owner in uIds
  const currentUser = findUser(token);
  for (const uId of uIds) {
    if (uId === currentUser.uId) {
      return { error: 'owner is part of uIds' };
    }
  }

  let name = currentUser.handleStr;

  for (const element of uIds) {
    name = name + ', ' + data.users[element].handleStr;
  }
  const membersArray = uIds;
  membersArray.push(currentUser.uId);

  const dm = {
    dmId: data.dms.length,
    name: name,
    owner: currentUser.uId,
    members: membersArray,
    messages: [],
  };

  data.dms[data.dms.length] = dm;
  setData(data);

  return {
    dmId: data.dms.length - 1,
  };
}

/**
 * Returns the list of DMs that the user is a member of.
 *
 * @param {String} token
 * @returns {Array<dm> | Object} dms | error
 */
function dmListV1 (token: string): Array<dm> | object {
  const data = getData();

  // invalid token error
  if (validToken(token) === false) {
    return {
      error: 'Invalid token'
    };
  }

  const currentUser = findUser(token);
  const dmArray: Array<dm> = [];

  // create array of dms
  for (const dm of data.dms) {
    if (dm.members.includes(currentUser.uId)) {
      dmArray.push({ dmId: dm.dmId, name: dm.name });
    }
  }

  return { dms: dmArray };
}

/**
 * Remove an existing DM, so all members are no longer in the DM.
 * This can only be done by the original creator of the DM.
 *
 * @param {String} token
 * @param {Number} dmId
 * @returns {}
 */
function dmRemoveV1 (token: string, dmId: number) {
  const data = getData();

  // Invalid token error
  if (validToken(token) === false) {
    return {
      error: 'Invalid token'
    };
  }

  // Invalid dmId error
  const currentDm = data.dms.find(d => d.dmId === dmId);
  if (currentDm === undefined) {
    return {
      error: 'Invalid dmId'
    };
  }

  const currentUser = findUser(token);

  // User is not a member of DM error
  if (data.dms[dmId].members.includes(currentUser.uId) === false) {
    return {
      error: `User(${token}) is not a member of the dm(${dmId})`
    };
  }

  // User is not the original DM creator
  if (currentUser.uId !== data.dms[dmId].owner) {
    return {
      error: `User(${token}) is not the original creator of the dm(${dmId})`
    };
  }

  const dmArray: Array<dm> = [];

  // Creates a new array of the DMs excluding the one to be removed
  for (const dm of data.dms) {
    if (dm.dmId !== dmId) {
      dmArray.push(dm);
    }
  }

  data.dms = dmArray;
  setData(data);
  return {};
}

/**
 * Given a DM with ID dmId that the authorised user
 * is a member of, provide basic details about the DM.
 *
 * @param {String} token
 * @param {Number} dmId
 * @returns {Object} name, members
 */
function dmDetailsV1 (token: string, dmId: number) {
  const data = getData();

  // Invalid token error
  if (validToken(token) === false) {
    return {
      error: 'Invalid token'
    };
  }

  // Invalid dmId error
  const currentDm = data.dms.find(d => d.dmId === dmId);
  if (currentDm === undefined) {
    return {
      error: 'Invalid dmId'
    };
  }

  const currentUser = findUser(token);

  // User is not a member of DM error
  if (data.dms[dmId].members.includes(currentUser.uId) === false) {
    return {
      error: `User(${token}) is not a member of the dm(${dmId})`
    };
  }

  // Create members array output and set the owner as the first member listed
  const membersArray: Array<user> = [
    {
      uId: currentUser.uId,
      email: currentUser.email,
      nameFirst: currentUser.nameFirst,
      nameLast: currentUser.nameLast,
      handleStr: currentUser.handleStr
    }
  ];

  for (const member of data.dms[dmId].members) {
    membersArray.push({
      uId: data.users[member].uId,
      email: data.users[member].email,
      nameFirst: data.users[member].nameFirst,
      nameLast: data.users[member].nameLast,
      handleStr: data.users[member].handleStr
    });
  }

  // Remove the owner because they get repeated at the end
  membersArray.pop();

  return {
    name: currentDm.name,
    members: membersArray
  };
}

/**
 * Given a DM with ID dmId, the user is removed as a member of this DM.
 * The creator is allowed to leave and the DM will still exist if this happens.
 * This does not update the name of the DM.
 *
 * @param {String} token
 * @param {Number} dmId
 * @returns {}
 */
function dmLeaveV1 (token: string, dmId: number) {
  const data = getData();

  // Invalid token error
  if (validToken(token) === false) {
    return {
      error: 'Invalid token'
    };
  }

  // Invalid dmId error
  const currentDm = data.dms.find(d => d.dmId === dmId);
  if (currentDm === undefined) {
    return {
      error: 'Invalid dmId'
    };
  }

  const currentUser = findUser(token);

  // User is not a member of DM error
  if (data.dms[dmId].members.includes(currentUser.uId) === false) {
    return {
      error: `User(${token}) is not a member of the dm(${dmId})`
    };
  }

  const Index = data.dms[dmId].members.indexOf(currentUser.uId);
  data.dms[dmId].members.splice(Index, 1);

  setData(data);
  return {};
}

function dmMessagesV1(token: string, dmId: number, start: number) {
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

  const currentUser = findUser(token);

  // User is not a member of DM error
  if (data.dms[dmId].members.includes(currentUser.uId) === false) {
    return {
      error: `User(${token}) is not a member of the dm(${dmId})`
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
      messagesArray = messages.slice(start, end);
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
  const maxMessageId = data.dms[dmId].messages.length;
  console.log(maxMessageId);
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

export { dmCreateV1, dmListV1, dmRemoveV1, dmDetailsV1, dmLeaveV1, dmMessagesV1, messageSendDmV1 };
