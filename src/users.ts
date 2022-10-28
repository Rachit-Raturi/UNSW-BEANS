import { getData, setData } from './dataStore';
import { validToken, validUId, validName, validHandleStr, validEmail, extractUser, findUser } from './helperfunctions'

/**
  * Creates a new user profile 
  * 
  * @param {string} token 
  * @param {number} uId 
  * @returns {} 
  * 
*/
function userProfileV1 (token: string, uId: number) {
  if (validToken(token) === false) {
    return { error: 'invalid token' };
  }
  if (validUId(uId) === false) {
    return { error: 'invalid uId' };
  }
  console.log(validToken(token), validUId(uId))
  return { user: extractUser(uId) };
}

function usersAllV1 (token: string) {
  if (validToken(token) === false) {
    return { error: 'invalid token' };
  }
  console.log(validToken(token))
  return { users: extractUser()};
}

/**
  * Sets the name for the profile
  * 
  * @param {string} token 
  * @param {string} nameFirst 
  * @param {string} nameLast 
  * @returns {} 
  * 
*/
function userSetNameV1 (token: string, nameFirst: string, nameLast: string) {
  let data = getData();
  if (validToken(token) === false) {
    return {
      error: 'invalid token',
    }
  }
  
  if (validName(nameFirst) === false) {
    return {
      error: 'invalid userhandle',
    }
  }

  if (validName(nameLast) === false) {
    return {
      error: 'invalid userhandle',
    }
  }
  console.log(validToken(token), validName(nameFirst), validName(nameLast))
  const authUserId = findUser(token).uId;
  data.users[authUserId].nameFirst = nameFirst;
  data.users[authUserId].nameLast = nameLast;
  setData(data);
  return {};
}

/**
  * Sets the userSetHandle for the profile
  * 
  * @param {string} token 
  * @param {string} handleStr 
  * @returns {} 
  * 
*/
function userSetHandleV1 (token: string, handleStr: string) {
  let data = getData();
  if (validToken(token) === false) {
    return {
      error: 'invalid token',
    }
  }
  
  if (validHandleStr(handleStr) === false) {
    return {
      error: 'invalid userhandle',
    }
  }

  console.log(validToken(token), validHandleStr(handleStr))
  const authUserId = findUser(token).uId;
  data.users[authUserId].handleStr = handleStr;
  setData(data);
  return {};
}

function userSetEmailV1 (token: string, email: string) {
  let data = getData();
  if (validToken(token) === false) {
    return {
      error: 'invalid token',
    }
  }
  
  if (validEmail(email) === false) {
    return {
      error: 'invalid token',
    }
  }
  console.log(validToken(token), validEmail(email))
  const authUserId = findUser(token).uId;
  data.users[authUserId].email = email;
  setData(data);
  return {};
}

export { userProfileV1, usersAllV1, userSetNameV1, userSetHandleV1, userSetEmailV1 };
