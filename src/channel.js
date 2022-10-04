import { getData, setData } from './dataStore.js';

function channelJoinV1( authUserId, channelId ) {
  let data = getData();

  // invalid channelId error 
  if (data.channels[channelId] === undefined) { 
    return {
      error: "channelId does not refer to a valid channel"
    };
  }
  // already member error 

  if (data.channels[channelId].members.includes(authUserId)) { 
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
  data.channels[channelId].members.push(authUserId); 
  setData(data); 

  return {};
}

function channelInviteV1( authUserId, channelId, uId ) { 
  const data = getData();

  const isvalidAuthuser = data.users.find(a => a.authUserId === authUserId);  
  if (isvalidAuthuser === undefined) {
    return {
        error: "invalid user",
    };
  }

  const isvaliduser = data.users.find(a => a.authUserId === authUserId);  
  if (isvaliduser === undefined) {
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
  console.log(data.channels[channelId].members);

  for (const element of data.channels[channelId].members) {
    if (element === authUserId) {
      return {
        error: "already a member",
      };
    }
  }

  let membersarray = data.channels.members;
    membersarray.push(uId);
  data.channels.members = membersarray;

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