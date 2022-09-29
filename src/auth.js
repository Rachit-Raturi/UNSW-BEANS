import validator from 'validator';
import { getData, setData} from './dataStore'

function authLoginV1(email, password) {
  return { 
    authUserId: 1,
  };
}

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
    authUserId: data.users.length + 1,
    password: password,
    nameFirst: nameFirst,
    nameLast: nameLast,
    userHandle: userHandle,
  };
  data.users[data.users.length] = user;
  
  return { 
    authUserId: data.users.length,
  };
}

export default authRegisterV1;