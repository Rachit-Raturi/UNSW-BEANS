import { getData, setData } from './dataStore';

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

function dmCreateV1(token: string, uIds?: number) {
  const data = getData();
  const currentUser = findUser(token);
  type handleStrKey = keyof typeof currentUser;
  const handleStrVar = 'handleStr' as handleStrKey;
  const ownerHandle: string = currentUser[handleStrVar];
  type uIdKey = keyof typeof currentUser;
  const uIdVar = 'uId' as uIdKey;
  const authUserId: number = currentUser[uIdVar];

  // invalid user Id
  for (const uId of uIds) {
    if (data.users[uId] === undefined) {
      return {
        error: `Invalid uId ${uId}`
      };
    }
  }

  // duplicate user Id
  let uniqueUId = [...new Set(uIds)];
  for (const uId of Uids) {
    if (uniqueUId !== uIds) {
      return {
        error: 'Duplicate uIds have been entered'
      };
    }
  }

  // invalid token
  if (validToken(token) === false) {
    return {
      error: 'Invalid token'
    };
  }

  const name = [];
  name.push(ownerHandle);

  const dm = {
    dmId: data.dm.length,
    name: name,
    isPublic: isPublic,
    ownerMembers: authUserId,
    allMembers: uIds,
  };

  data.dms[data.dms.length] = dm;
  setData(data);

  return {
    dmId: data.dms.length - 1,
  };
}

function dmMessagesV1(token: string, dmId: number, start: number) {
  const data = getData();
  const currentUser = findUser(token);
  type uIdKey = keyof typeof currentUser;
  const uIdVar = 'uId' as uIdKey;
  const authUserId: number = currentUser[uIdVar];
  
  // invalid dmId
  const isValidDm = data.dms.find(d => d.dmId === dmId);
  if (isValidDm === undefined) {
    return {
      error: 'Invalid dm'
    };
  }

  // invalid token
  if (validToken(token) === false) {
    return {
      error: 'Invalid token'
    };
  }

  // check if user is a member of dm
  const checkIsMember = data.dms[dm].allMembers;
  const isValidMember = checkIsMember.find(m => m === authUserId);
  if (isValidMember === undefined) {
    return {
      error: `The authorised user ${authUserId} is not a member of the dm ${dmId}`
    };
  }

  const numberOfMessages = data.dms.messages.length;
  const messages = data.dms.messages;
  let end;
  // CHeck whether starting index is < 0
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
        // If there is < 50 messages left in the dm history, end pagination
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