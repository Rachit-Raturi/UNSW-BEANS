import { getData } from './dataStore';
import { validEmail, validtoken, validHandleStr, findUser } from './helperfunctions'

/**
 * Given a valid authUserId and uId, creates and returns a
 * new user with its details
 *
 * @param {Number} authUserId
 * @param {Number} uId
 * @returns {Object} user
 */
function userProfileV1 (authUserId, uId) {
  const data = getData();

  if ((data.users[authUserId]) === undefined) {
    return {
      error: 'authUserId does not refer to a valid ID',
    };
  }

  if ((data.users[uId]) === undefined) {
    return {
      error: 'uId does not refer to a valid ID',
    };
  }

  const user = data.users[uId];

  return {
    user: {
      uId: user.uId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.handleStr,
    },
  };
}

function userSetHandleV1 (token: string, handleStr: string) {
  let data = getData();
  if (validToken(token) === false) {
    return {
      error: 'invalid token',
    }
  }
  
  if (validHandleStr(token) === false) {
    return {
      error: 'invalid userhandle',
    }
  }

  const authUserId = findUser(token).uId;
  data.users[authUserId].handleStr = handleStr;
  setData(data);
  return {};
}




export { userProfileV1 };
