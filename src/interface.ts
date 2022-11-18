export interface channeljoin {
  numChannelsJoined: number,
  timeStamp: number
}

export interface dmjoin {
  numDmsJoined: number,
  timeStamp: number
}

export interface messagesent {
  numMessagesSent: number,
  timeStamp: number
}

export interface user {
  uId: number,
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string,
  channelsJoined: channeljoin[],
  dmsJoined: dmjoin[],
  messagesSent: messagesent[],
  tokens: string[],
  resetCode: string,
  isRemoved: boolean
  globalPermission: number
}

export interface message {
  messageId: number,
  uId: number,
  message: string,
  timeSent: number
}

export interface channel {
  channelId: number,
  name: string,
  allMembers: number[],
  ownerMembers: number[],
  isPublic: boolean,
  messages: message[]
}

export interface dm {
  dmId: number,
  name: string,
  owner: number,
  members: number[],
  messages: message[]
}

export interface channelexist {
  numChannelsExist: number,
  timeStamp: number
}

export interface dmexist {
  numDmsExist: number,
  timeStamp: number
}

export interface messageexist {
  numMessagesExist: number,
  timeStamp: number
}

export interface Datastore {
  users: user[],
  channels: channel[],
  dms: dm[],
  stats: {
    channelsExist: channelexist[],
    dmsExist: dmexist[],
    messagesExist: messageexist[],
  }
}
