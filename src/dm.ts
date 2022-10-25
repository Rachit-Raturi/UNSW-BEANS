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