import { getData, setData } from './dataStore';

let data = getData();

function channelsCreateV1(authUserId, name, isPublic ) {

  // invalid userId
  if (data.users[authUserId] === undefined) { 
    return {
      error: "authUserId does not refer to a valid ID"
    };
  }

  // name length invalid - between 1 and 20 (inclusive) 
  if (name.length < 1 || name.length > 20) {
    return {
      error: 'name is not between 1 and 20 characters inclusive',
    };
  }

  let members = []; 
  let owners = []; 
  owners.push(authUserId); 
  members.push(authUserId); 

  let channel = {
    channelId: data.channels.length,
    name: name,
    isPublic: isPublic,
    owners: owners,
    members: members
  };

  data.channels[data.channels.length] = channel;
  
  return { 
    channelId: data.channels.length - 1,
  };
}

function channelsListV1(authUserId) {
  return {
    channels: [
      {
        channelId: 1,
        name: 'My Channel',
      }
    ],
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
  };
}

export {channelsCreateV1, channelsListV1, channelsListAllV1};
