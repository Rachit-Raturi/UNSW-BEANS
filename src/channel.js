import { getData, setData} from './dataStore.js'


function channelJoinV1( authUserId, channelId ) { 
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

  for (element of data.channels[channelId].allMembers) {
    if (element === authUserId) {
      return {
        error: "already a member",
    };
    }
  }


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