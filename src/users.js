import { getData, setData } from './dataStore.js';

function userProfileV1 (authUserId, uId) {
  let data = getData();

  if ((data.users[authUserId]) === undefined) { 
    return {
      error: "authUserId does not refer to a valid ID",
    };
  }

  if ((data.users[uId]) === undefined) {
    return {
      error: "uId does not refer to a valid ID",
    };
  }

  let user = data.users[uId];

  return {
    user: {
      uId: user.uId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.handleStr,
    },
  }
}

export {userProfileV1};