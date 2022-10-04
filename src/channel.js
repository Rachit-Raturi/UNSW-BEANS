import { authRegisterV1, authLoginV1 } from './auth.js';
import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels.js';
import { getData, setData } from './dataStore.js';

function channelJoinV1( authUserId, channelId ) { 
  return {};
}

function channelInviteV1( authUserId, channelId, uId ) { 
  return {};
}

/**
 * Given a channel with ID channelId that the authorised user
 * is a member of, provides basic details about the channel.
 */
function channelDetailsV1 (authUserId, channelId) {
  return {
    name: 'Hayden',
    ownerMembers: [
      {
        uId: 1,
        email: 'example@gmail.com',
        nameFirst: 'Hayden',
        nameLast: 'Jacobs',
        handleStr: 'haydenjacobs',
      }
    ],
    allMembers: [
      {
        uId: 1,
        email: 'example@gmail.com',
        nameFirst: 'Hayden',
        nameLast: 'Jacobs',
        handleStr: 'haydenjacobs',
      }
    ],
  };
}

function channelMessagesV1(authUserId, channelId, start) {
  const data = getData();
  const isValidUser = data.users.find(a => a.authUserId === authUserId);
  if (isValiduser === undefined) {
    return { 
      error: 'Invalid user',
    };
  }
  
  
  const isValidChannel = data.channels.find(c => c.channelId === channelId);
  if (isValidChannel === undefined) {
    return {
      error: 'Invalid channel',
    };
  }
  
  let members = allMembers.channelDetailsV1(channelId);
  for (let j = 0; j < members.length; j++) {
    if (j === members.length) {
      return {
        error: 'The authorised user is not a member of the channel',
      };
    }
  }  
  
  return {
    messages: [
      {
        messageId: 1,
        uId: 1,
        message: 'Hello world',
        timeSent: 1582426789,
      }
    ],
    start: 0,
    end: 50,
  };
}

export {channelJoinV1, channelInviteV1, channelDetailsV1, channelMessagesV1};
