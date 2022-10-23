import { getData } from './dataStore';
import { validToken, validUId, extractUser } from './helperfunctions'

interface user {
  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string,
};

function userProfileV1 (token: string, uId: number): user {
  if (validToken(token) === false) {
    return { error: 'invalid token' };
  }

  if (validUId(uId) === false) {
    return { error: 'invalid uId' };
  }

  return { user: extractUser(uId) };
}

function usersAllV1 (token: string): user[] {
  if (validToken(token) === false) {
    return { error: 'invalid token' };
  }

  return { users: extractUser()};
}

export { userProfileV1, usersAllV1 };
