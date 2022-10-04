import { getData, setData} from './dataStore.js'


function channelJoinV1( authUserId, channelId ) { 
  return {};
}

function channelInviteV1( authUserId, channelId, uId ) { 
  
  setData({
    'users': [
      {
        email: 'cow@gmail.com',
        authUserId: 1,
        password: 'turtle',
        nameFirst: 'cat',
        nameLast: 'fish',
        userHandle: 'catfish0'
      },
      {
        email: 'cow1@gmail.com',
        authUserId: 2,
        password: 'turtle',
        nameFirst: 'cat',
        nameLast: 'fish',
        userHandle: 'catfish1'
      },
    ],
    'channels': [{
      channelId: 1,
      name: 'channel1',
      isPublic: true,
      owners: [1],
      members: [2],
    },
    {
      channelId: 2,
      name: 'channel2',
      isPublic: true,
      owners: [2],
      members: [],
    }
    ]
  
  });




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

  const channel_array = data.channels[channelId - 1]
  console.log(channel_array);
  console.log(channel_array.members);
  console.log(channel_array.owners);
  channel_array.members.push(1);
  data.channels[channelId - 1] = channel_array;


  return {};
}

console.log(channelInviteV1(2,2,1))
console.log(getData().channels[1].members);

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