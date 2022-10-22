import { getData, setData } from './dataStore';
import { validEmail, validtoken, findUser } from './helperfunctions'

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

function userSetEmailV1 (token: string, email: string) {
  let data = getData();
  if (validtoken(token) === false) {
    return {
      error: 'invalid token',
    }
  }
  
  if (validEmail(token) === false) {
    return {
      error: 'invalid token',
    }
  }

  const authUserId = findUser(token).uId;
  data.users[authUserId].email = email;
  setData(data);
  return {};
}

export { userProfileV1, userSetEmailV1 };