import { getData, setData } from './dataStore.js';

/**
 * Given a valid authUserId and channel name, creates and 
 * returns a new channel with its details 
 * 
 * @param {Number} authUserId
 * @param {String} name
 * @param {Boolean} isPublic
 * @returns {Object} channel
 */

function channelsCreateV1(authUserId, name, isPublic ) {
  let data = getData();
  
  // invalid userId
  if (data.users[authUserId] === undefined) { 
    return {
      error: 'Invalid user'
    };
  }

  // name length invalid - between 1 and 20 (inclusive) 
  if (name.length < 1 || name.length > 20) {
    return {
      error: 'Name is not between 1 and 20 characters inclusive'
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
    ownerMembers: owners,
    allMembers: members,
  };

  data.channels[data.channels.length] = channel;
  setData(data); 

  return { 
    channelId: data.channels.length - 1,
  };
}

/**
  * Given a valid authUserId will return a list 
  * of all the public channels the user is in.
  *
  * @param {number} authUserId - The authUserId of the user
  * @returns {channels: {Array<{channelId: number, name: string}>}} 
  * - returns array of public channels
*/
function channelsListV1(authUserId) {
  const data = getData();
  
  if (data.users[authUserId] === undefined) {
    return {
        error: 'Invalid user'
    };
  }
  
  const allChannelsArray = data.channels;
  const publicChannelsArray = [];
  const outputChannels = [];
    
  for (const element of allChannelsArray) {
    if (element.isPublic === true) {
      publicChannelsArray.push(element);
    }
  }

  for (const element of publicChannelsArray) {
    if ((element.allMembers).includes(authUserId)) {
      outputChannels.push({channelId: element.channelId, name: element.name})
    }
  }
  
  return {
    channels: outputChannels,
  };

}

function channelsListAllV1( authUserId ) { 
  let data = getData();

  if (data.users[authUserId] === undefined) { 
    return {
      error: "authUserId does not refer to a valid ID"
    };
  }

  const allChannelsArray = data.channels;
  let outputChannels = []
    
  for (const element of allChannelsArray) {
    if ((element.allMembers).includes(authUserId)) {
      outputChannels.push({channelId: element.channelId, name: element.name})
    }
  }

  return {
    channels: outputChannels,
  };
}

export { channelsCreateV1, channelsListV1, channelsListAllV1 };
