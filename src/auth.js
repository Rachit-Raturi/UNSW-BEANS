import validator from 'validator';
import { getData, setData} from './dataStore.js'

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
  let originaluserHandle = userHandle;
  userHandle = userHandle.substring(0, Math.min(userHandle.length, 20));
  let i = 0;
  for (let user of data.users) {
    if (user.userHandle === userHandle) {
      userHandle = originaluserHandle + i.toString();
      i++;
      if (i === 10) {
        i = 0;
        originaluserHandle = originaluserHandle + i.toString();
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
  console.log(userHandle);
  setData(data);

  return { 
    authUserId: data.users[data.users.length - 1].authUserId,
  };
}

export { authRegisterV1, authLoginV1 };

authRegisterV1('geeg@gmasil.com','abalone','first','last');
authRegisterV1('geeg1@gmasil.com','a2balone','first','last');
authRegisterV1('geeg2@gmasil.com','a3balone','first','last');
authRegisterV1('geeg3@gmasil.com','a3balone','first','last');
authRegisterV1('geeg4@gmasil.com','a3balone','first','last');
authRegisterV1('geeg5@gmasil.com','a3balone','first','last');
authRegisterV1('geeg6@gmasil.com','a3balone','first','last');
authRegisterV1('geeg7@gmasil.com','a3balone','first','last');
authRegisterV1('geeg8@gmasil.com','a3balone','first','last');
authRegisterV1('geeg9@gmasil.com','a3balone','first','last');
authRegisterV1('geeg10@gmasil.com','a3balone','first','last');
authRegisterV1('geeg11@gmasil.com','a3balone','first','last');
authRegisterV1('geeg12@gmasil.com','a3balone','first','last');
authRegisterV1('geeg13@gmasil.com','a3balone','first','last');
authRegisterV1('geeg14@gmasil.com','abalone','first','last');
authRegisterV1('geeg15@gmasil.com','a2balone','first','last');
authRegisterV1('geeg16@gmasil.com','a3balone','first','last');
authRegisterV1('geeg17@gmasil.com','a3balone','first','last');
authRegisterV1('geeg18@gmasil.com','a3balone','first','last');
authRegisterV1('geeg19@gmasil.com','a3balone','first','last');
authRegisterV1('geeg20@gmasil.com','a3balone','first','last');
authRegisterV1('geeg21@gmasil.com','a3balone','first','last');
authRegisterV1('geeg22@gmasil.com','a3balone','first','last');
authRegisterV1('geeg23@gmasil.com','a3balone','first','last');
authRegisterV1('geeg240@gmasil.com','a3balone','first','last');
authRegisterV1('geeg25@gmasil.com','a3balone','first','last');
authRegisterV1('geeg26@gmasil.com','a3balone','first','last');
authRegisterV1('geeg27@gmasil.com','a3balone','first','last');