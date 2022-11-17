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
  profileImgUrl: string,
  tokens: string[]
}

export interface react {
  reactId: number,
  uIds: number[],
  isThisUserReacted: boolean,
}

export interface message {
  messageId: number,
  uId: number,
  message: string,
  timeSent: number,
  reacts: react[],
  isPinned: boolean
}

export interface standup {
  isActive: boolean,
  timeFinish: number,
  messages: string
}

export interface channel {
  channelId: number,
  name: string,
  allMembers: number[],
  ownerMembers: number[],
  isPublic: boolean,
  messages: message[],
  standup: standup
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
