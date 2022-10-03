import { getData, setData} from './dataStore'

function channelsCreateV1( authUserId, name, isPublic ) {

/* ID same as index 
  'channels': [
    channelId:
    name:
    isPublic:
    owners: []
    members: []
  ]
}
*/

return { 
    channelId: 1, 
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
  // error checking - invalid Id
  let data = getData();
  const user = data.users.find(a => a.authUserId === authUserId);
  if (user == undefined) { 
    return {
      error: "academicId does not refer to a valid user"
    };
  }

  return data.channels; 
}

export {channelsCreateV1, channelsListV1, channelsListAllV1};