/*
// Delete file before submiting
// input and outputs of all functions
*/

// auth
function authLoginV1(email, password) {
  return { 
      authUserId: 1,
   }
}

function authRegisterV1(email, password, nameFirst, nameLast) {
  return { 
      authUserId: 1,
  }
}

// channels
function channelsCreateV1( authUserId, name, isPublic ) {
  return { 
    channelId: 1, 
  };
}

function channelsListAllV1( authUserId ) { 
  return {
      channels: [
        {
          channelId: 1,
          name: 'My Channel',
        }
      ],
    }
}

function channelsListV1(authUserId) {
  return {
    channels: [
      {
        channelId: 1,
        name: 'My Channel',
      }
    ],
  }
}

// channel
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
    }
}

function channelInviteV1( authUserId, channelId, uId ) { 
  return {};
}

function channelJoinV1( authUserId, channelId ) { 
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

function userProfileV1(authuserId, uId) {
  return {
    user: {
      uId: 1,
      email: 'example@gmail.com',
      nameFirst: 'Hayden',
      nameLast: 'Jacobs',
      handleStr: 'haydenjacobs',
    },
  }
}
