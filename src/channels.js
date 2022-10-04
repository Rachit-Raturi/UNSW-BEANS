import { getData, setData} from './dataStore.js';

function channelsCreateV1( authUserId, name, isPublic ) {
  return { 
    channelId: 1, 
  };
}

/**
  * Given a valid authUserId will return a list 
  * of all the public channels the user is in.
  *
  *@param {number} authUserId - The authUserId of the user
  *
  *
  *@returns {channels: {Array<{channelId: number, name: string}>}} 
  * - returns array of public channels

*/
function channelsListV1(authUserId) {
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
        members: [1,2],
      },
      {
        channelId: 2,
        name: 'channel2',
        isPublic: true,
        owners: [2],
        members: [1,2],
      }
      ]
    
    });

  const data = getData();
  const user = data.users.find(a => a.authUserId === authUserId);
  
  if (user === undefined) {
    return {
        error: "invalid user",
    };
  }
  
  
  
  const allchannelsArray = data.channels;
  const publicChannelsArray = [];
    
  
    
  for (const element of allchannelsArray) {
    if (element.isPublic === true) {
      publicChannelsArray.push(element);
    }
  }
  
  for (const element of publicChannelsArray) {
    if ((element.owners).includes(authUserId)) {
      console.log('works');
  }
  console.log(element.owners);

  }
  console.log('**');
  console.log(publicChannelsArray);
  console.log('**');
 
  return {
    channels: publicChannelsArray,
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

console.log(channelsListV1(1));

export {channelsCreateV1, channelsListV1, channelsListAllV1};
