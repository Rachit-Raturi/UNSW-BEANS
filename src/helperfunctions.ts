import validator from 'validator';
import { getData } from './dataStore';

function validEmail(email: string): boolean {
  let data = getData();
  if (!validator.isEmail(email)) {
    return false;
  }

  for (const users of data.users) {
    if (users.email === email) {
      return false;
    }
  }

  return true;
}

function validtoken(token: string): boolean {
  let data = getData();
  const isValidToken = data.users.find(a => a.token === token);
  if (isValidToken === undefined) {
    return false;
  }

  return true;
}


export { validEmail };

