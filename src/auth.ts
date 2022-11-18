import validator from 'validator';
import { getData, setData } from './dataStore';
import uniqid from 'uniqid';
import { hashPassword, hashToken, hash } from './hash';
import HTTPError from 'http-errors';
// import Mail from 'nodemailer/lib/mailer';

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
    if (users.email === email && users.isRemoved === false) {
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
        throw HTTPError(400, 'Incorrect password has been entered');
      }
    }
  }
  throw HTTPError(400, 'Email entered does not belong to a user');
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
  let gp = 2;

  if (data.users.length === 0) {
    gp = 1;
  }

  if (!validator.isEmail(email)) {
    throw HTTPError(400, 'Invalid email has been entered');
  }
  // Test for whether or not the email is already in use
  if (data.users !== null) {
    for (const users of data.users) {
      if (users.email === email && users.isRemoved === false) {
        throw HTTPError(400, 'Email is already in use');
      }
    }
  }
  // Tests for whether the Password is valid
  if (password.length < 6 && password.length !== 0) {
    throw HTTPError(400, 'Password is less than 6 characters');
  } else if (password.length === 0) {
    throw HTTPError(400, 'No password was entered');
  }
  // Tests for whether the first name and last names are valid
  if (nameFirst.length < 1 || nameFirst.length > 50) {
    throw HTTPError(400, 'First name is not between 1 to 50 characters inclusive');
  } else if (nameLast.length < 1 || nameLast.length > 50) {
    throw HTTPError(400, 'Last name is not between 1 to 50 characters inclusive');
  }
  // Generating the userhandle
  let userHandle = nameFirst.toLowerCase().replace(/[^a-z0-9]/gi, '') + nameLast.toLowerCase().replace(/[^a-z0-9]/gi, '');
  userHandle = userHandle.substring(0, Math.min(userHandle.length, 20));
  const originalUserHandle = userHandle;
  let i = 0;
  for (const user of data.users) {
    if (user.handleStr === userHandle && user.isRemoved === false) {
      userHandle = originalUserHandle + i;
      i++;
    }
  }

  // Generating the session token
  const session = uniqid();

  const token = [
    hashToken(session)
  ];
  const time = Math.floor(Date.now() / 1000);
  // Register the user
  const user = {
    email: email,
    uId: data.users.length,
    password: hashPassword(password),
    nameFirst: nameFirst,
    nameLast: nameLast,
    handleStr: userHandle,
    channelsJoined: [
      {
        numChannelsJoined: 0,
        timeStamp: time,
      }
    ],
    dmsJoined: [
      {
        numDmsJoined: 0,
        timeStamp: time,
      }
    ],
    messagesSent: [
      {
        numMessagesSent: 0,
        timeStamp: time,
      }
    ],
    profileImgUrl: 'http://localhost:3200/imgurl/base.jpg',
    tokens: token,
    isRemoved: false,
    globalPermission: gp
  };
  data.users.push(user);

  setData(data);

  return {
    token: token[0],
    authUserId: user.uId,
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
      if (users.tokens.length === 1) {
        users.tokens = [];
      } else {
        console.log(token);
        const index = users.tokens.indexOf(token);
        users.tokens.splice(index, 1);
      }
      setData(data);
      return {};
    }
  }
  throw HTTPError(403, 'Token entered was invalid');
}

/**
 * Given an email address, if the email address belongs to a registered user,
 * sends them an email containing a secret password reset code. This code, when
 * supplied to auth/passwordreset/reset, shows that the user trying to reset the
 * password is the same user who got sent the email contaning the code. No error
 * should be raised when given an invalid email, as that would pose a security/privacy
 * concern. When a user requests a password reset, they should be logged out of all current
 * sessions.
 * @param {string} email - email of the user requesting a password change
 */

function authPasswordResetRequestV1(email: string) {
  const nodemailer = require('nodemailer');

  const code = uniqid();

  const data = getData();
  for (const users of data.users) {
    if (users.email === email) {
      if (users.tokens.length !== 0) {
        return {};
      }
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'beanstreats05@gmail.com',
          pass: 'fkzeuwhowxwsumbj',
        }
      });

      transporter.sendMail({
        from: 'beanstreats05@gmail.com',
        to: email,
        subject: 'Resetting Password',
        text: code,
      });
      users.resetCode = hash(code);
    }
  }

  setData(data);
  return {};
}

function authPasswordResetV1(resetCode: string, newPassword: string) {
  const data = getData();

  if (newPassword.length < 6) {
    throw HTTPError(400, 'New password is less than 6 characters long');
  }

  for (const user of data.users) {
    if (user.resetCode === hash(resetCode)) {
      user.password = hashPassword(newPassword);
      user.resetCode = undefined;
      setData(data);
      return {};
    }
  }

  throw HTTPError(400, 'The reset code entered is not valid');
}

export { authLoginV1, authRegisterV1, authLogoutV1, authPasswordResetRequestV1, authPasswordResetV1 };
