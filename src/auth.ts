import validator from 'validator';
import { getData, setData } from './dataStore';
import uniqid from 'uniqid';
import { hashPassword, hashToken } from './hash';

/**
 * Given a valid registered email and password the function
 * will return the assigned authUserId unique to the user
 *
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {number} authUserId - The authUserid of the user
 * @returns {string} token - the token to mark the users
 */
function authLoginV1(email: string, password: string) {
  const data = getData();
  for (const users of data.users) {
    if (users.email === email) {
      if (hashPassword(password) === users.password) {
        // Generate the token for the session
        const token = uniqid();
        users.tokens.push(hashToken(token));
        setData(data);
        return {
          token: hashToken(token),
          authUserId: users.uId,
        };
      } else {
        return {
          error: 'Incorrect password has been entered',
        };
      }
    }
  }
  return {
    error: 'Email entered does not belong to a user',
  };
}

/**
 * Given a valid email, password, first name and last name
 * will return a generated authUserId unique to the user
 *
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @param {string} nameFirst - The first name of the user
 * @param {string} nameLast - The last name of the user
 * @returns {Number} authUserId - The authUserId of the user
 * @return {string} token - the token of the session
 */
function authRegisterV1(email: string, password: string, nameFirst: string, nameLast: string) {
  const data = getData();
  // Test for whether or not the email is invalid
  if (!validator.isEmail(email)) {
    return {
      error: 'Invalid email entered',
    };
  }
  // Test for whether or not the email is already in use
  if (data.users !== null) {
    for (const users of data.users) {
      if (users.email === email) {
        return {
          error: 'Email is already in use',
        };
      }
    }
  }
  // Tests for whether the Password is valid
  if (password.length < 6 && password.length !== 0) {
    return {
      error: 'Password is less than 6 characters',
    };
  } else if (password.length === 0) {
    return {
      error: 'No password was entered',
    };
  }
  // Tests for whether the first name and last names are valid
  if (nameFirst.length < 1 || nameFirst.length > 50) {
    return {
      error: 'First name is not between 1 to 50 characters inclusive',
    };
  } else if (nameLast.length < 1 || nameLast.length > 50) {
    return {
      error: 'Last name is not between 1 to 50 characters inclusive',
    };
  }
  // Generating the userhandle
  let userHandle = nameFirst.toLowerCase() + nameLast.toLowerCase();
  userHandle = userHandle.substring(0, Math.min(userHandle.length, 20));
  const originalUserHandle = userHandle;
  let i = 0;
  for (const user of data.users) {
    if (user.handleStr === userHandle) {
      userHandle = originalUserHandle + i;
      i++;
    }
  }

  // Generating the session token
  const session = uniqid();

  const token = [
    hashToken(session)
  ];
  // Register the user
  const user = {
    email: email,
    uId: data.users.length,
    password: hashPassword(password),
    nameFirst: nameFirst,
    nameLast: nameLast,
    handleStr: userHandle,
    tokens: token
  };
  data.users.push(user);

  setData(data);

  return {
    token: token[0],
    authUserId: data.users.length - 1,
  };
}

/**
 * Given a valid registered token the user will be logged out
 * of the session that is connected to the token
 *
 * @param {string} token - the token of the users session
 */

function authLogoutV1(token: string) {
  const data = getData();
  for (const users of data.users) {
    if (users.tokens.includes(token)) {
      const index = users.tokens.indexOf(token);
      users.tokens.splice(index, 1);
      setData(data);
      return {};
    }
  }
  return { error: 'Token entered was invalid' };
}

export { authLoginV1, authRegisterV1, authLogoutV1 };
