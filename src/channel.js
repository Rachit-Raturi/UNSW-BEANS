import { getData, setData } from './dataStore';

/**
 * Given a channel with ID channelId that the authorised user
 * is a member of, provides basic details about the channel.
 * 
 * @param {Number} authUserId
 * @param {Number} channelId
 * @returns {Object} channel
 */
function channelDetailsV1 (authUserId, channelId) {
  let data = getData();

  // invalid channelId error 
  if (data.channels[channelId] === undefined) { 
    return {
      error: 'Invalid channel'
    };
  }

  // not a member error
  if (data.channels[channelId].members.includes(authUserId) === false) { 
    return {
      error: 'User is not a member of this channel'
    };
  }

  // invalid userId error
  if (data.users[authUserId] === undefined) { 
    return {
      error: 'Invalid user'
    };
  }

  return {
    name: data.channels[channelId].name,
    isPublic: data.channels[channelId].isPublic,
    owners: data.channels[channelId].owners,
    members: data.channels[channelId].members
  };
}

function channelJoinV1( authUserId, channelId ) {
  let data = getData();

  // invalid channelId error 
  if (data.channels[channelId] === undefined) { 
    return {
      error: 'Invalid channel'
    };
  }
  // already member error 
  if (data.channels[channelId].members.includes(authUserId)) { 
    return {
      error: 'User is already a member of this channel'
    };
  }

  // private channel error 
  if (data.channels[channelId].isPublic === false) { 
    // global owner false 
    if (authUserId > 0) { 
      return {
        error: `User(${authUserId}) cannot join a private channel`
      };
    }  
  }

  // invalid userId
  if (data.users[authUserId] === undefined) { 
    return {
      error: 'Invalid user'
    };
  }

  data.channels[channelId].members.push(authUserId); 
  setData(data); 
  return {};
}

function channelInviteV1( authUserId, channelId, uId ) { 
  return {};
}

function channelMessagesV1(authUserId, channelId, start) {
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

export {channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1};