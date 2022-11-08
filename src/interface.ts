export interface user {
  uId: number,
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string,
  tokens: string[]
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

export interface Datastore {
  users: user[],
  channels: channel[],
  dms: dm[]
}
