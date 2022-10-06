import { getData, setData } from './dataStore.js';

function channelJoinV1( authUserId, channelId ) {
  let data = getData();

  // invalid authuserId
  const isvalidAuthuser = data.users.find(a => a.uId === authUserId);
  if (isvalidAuthuser === undefined) {
    return {
        error: "invalid user",
    };
  }
  // invalid channelId error 
  if (data.channels[channelId] === undefined) { 
    return {
      error: "channelId does not refer to a valid channel"
    };
  }
  // already member error 

  if (data.channels[channelId].allMembers.includes(authUserId)) { 
    return {
      error: "User is already a member of this channel"
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
  data.channels[channelId].allMembers.push(authUserId); 
  setData(data); 

  return {};
}

function channelInviteV1( authUserId, channelId, uId ) { 
  const data = getData();

  const isvalidAuthuser = data.users.find(a => a.uId === authUserId);
  if (isvalidAuthuser === undefined) {
    return {
        error: "invalid user",
    };
  }



  const isvalidchannel = data.channels.find(a => a.channelId === channelId);
  if (isvalidchannel === undefined) {
    return {
        error: "invalid channel",
    };
  }

  const isvalidmember = data.channels.find(a => a.allMembers === authUserId);
  if (isvalidmember === undefined) {
    return {
        error: "invalid authuser",
    };
  }

  for (const element of data.channels[channelId].allMembers) {
    if (element === authUserId) {
      return {
        error: "already a member",
      };
    }
  }

  let membersarray = data.channels[channelId].allMembers;
    membersarray.push(uId);
  data.channels.allMembers = membersarray;
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
  const isValiduser = data.users.find(a => a.uId === authUserId);
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
  
  let members = channelDetailsV1(channelId).allMembers;
  for (let j = 0; j < members.length; j++) {
    if (members[j] === authUserId) {
      break;
    }
    if (j === members.length) {
      return {
        error: `The authorised user ${authUserId} is not a member of the channel`,
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
    end: -1,
  };
}

export {channelJoinV1, channelInviteV1, channelDetailsV1, channelMessagesV1};
