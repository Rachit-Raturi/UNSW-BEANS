import validator from 'validator';
import { getData, setData} from './dataStore'

/**
  * Given a valid registered email and password the function
  * will return the assigned authUserId unique to the user
  *
  *@param {string} email - The email of the user
  *@param {string} password - The password of the user
  *
  *
  *@returns {{authUserId: number}} - The authUserid of the user
  * 
*/

function authLoginV1(email, password) {
  let data = getData();
  for (const users of data.users) {
    if (users.email === email) {
      if (password === users.password) {
        return {
          authUserId: users.authUserId,
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
  *@param {string} email - The email of the user
  *@param {string} password - The password of the user
  *@param {string} nameFirst - The first name of the user
  *@param {string} nameLast - The last name of the user
  *
  *
  *@returns {{authUserId: number}} - The authUserId of the user
  * 

*/

function authRegisterV1(email, password, nameFirst, nameLast) {
  let data = getData();
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
  let i = 0;
  for (let user of data.users) {
    if (user.userHandle === userHandle) {
      userHandle = userHandle + i.toString();
      i++;
      if (i === 10) {
        i = 0;
      }
      user = data.users[0];
    }
  }

  // Register the user
  let user = {
    email: email,
    authUserId: data.users.length,
    password: password,
    nameFirst: nameFirst,
    nameLast: nameLast,
    userHandle: userHandle,
  };
  data.users.push(user);
  
  setData(data);

  return { 
    authUserId: data.users[data.users.length - 1].authUserId,
  };
}

export { authRegisterV1, authLoginV1 };