import { getData } from './dataStore';
import { findUser, validToken } from './helperfunctions';
import HTTPError from 'http-errors';
import { message } from './interface';

/**
 * Given a string finds all messages containing the substring
 *
 * @param {string} token
 * @param {string} queryStr
 * @returns {message[]} messages
 */

export function search (token: string, queryStr: string): { messages: message[] } {
  const data = getData();
  queryStr = queryStr.toLowerCase();

  // checks if token is valid
  if (validToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  // checks if query string is within the length parameters
  if (queryStr.length > 1000 || queryStr.length < 1) {
    throw HTTPError(400, 'query string must be between 1 and 1000 characters');
  }

  // finds all dms and channels the user is a member of
  const uId = findUser(token).uId;
  const userPresent = [];
  console.log(data);
  for (const channel of data.channels) {
    if ((channel.allMembers).includes(uId)) {
      userPresent.push(channel);
    }
  }

  for (const dm of data.dms) {
    if ((dm.members).includes(uId)) {
      userPresent.push(dm);
    }
  }

  // extracts the messages from each dm and channel the user is a member of
  const messagesArray = [];

  for (const object of userPresent) {
    for (const message of object.messages) {
      messagesArray.push(message);
    }
  }

  // removes messages not containing the query string
  const messagesOutput = [];

  for (const message of messagesArray) {
    const lowerCaseMessage = (message.message).toLowerCase();

    if ((lowerCaseMessage).includes(queryStr)) {
      messagesOutput.push(message);
    }
  }

  return { messages: messagesOutput };
}
