
import request, { HttpVerb } from 'sync-request';
import { port, url } from '../src/config.json';
import { getData } from '../src/dataStore';
import { messageSend } from '../src/message';
import { authRegisterV1 } from '../src/auth';
import { channelsCreateV1 } from '../src/channels';
import { 
  requestChannelsCreate, 
  requestauthRegister, 
  requestMessageSend, 
  requestMessageEdit, 
  requestClear,
  requestChannelsList,
  requestChannelJoin

} from './helper'
const SERVER_URL = `${url}:${port}`;

let user; 
let user2; 
let channel;
let channel2;

beforeEach(() => {
  requestClear()
  user = requestauthRegister("email@gmail.com", "password", "firstname", "lastname"); 
  user2 = requestauthRegister("2email@gmail.com", "2password", "2firstname", "2lastname"); 
  channel = requestChannelsCreate(user.token, "name", true);
  channel2 = requestChannelsCreate(user.token, "name", true);
});

// ========================================================================= //
// Message Send Tests 

describe('Tests for Message Send', () => {
  test('Successful case', () => {
    
    expect(requestMessageSend(user.token, channel.channelId, "Message")).toStrictEqual({messageId: expect.any(Number)});
  });

  test('Successful case 1 - Ids are unique', () => { 

    let arr: number[];
    arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(requestMessageSend(user.token, channel.channelId, 'Message'));
    }

    const unique = Array.from(new Set(arr));
    expect(unique.length).toStrictEqual(10);
  });
  
  test('Invalid ChannelId', () => { 
    const invalidChannelId = channel2.channelId + 1;

    
    expect(requestMessageSend(user.token, invalidChannelId, 'Message')).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid Token', () => {
    let invalidToken = "0";
    expect(requestMessageSend(invalidToken, channel.channelId, "Message")).toStrictEqual({error: expect.any(String)});
  });

  test('User is not a Member', () => {
    expect(requestMessageSend(user2.token, channel.channelId, 'Message')).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid message lengths', () => {
    let longString: string;
    for (let i = 0; i <= 1000; i++) {
      longString += 'a';
    }

    const emptyString = '';
    expect(requestMessageSend(user.token, channel.channelId, longString)).toStrictEqual({ error: expect.any(String) });
    expect(requestMessageSend(user.token, channel.channelId, emptyString)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Tests for Message Edit', () => {
  test('Successful case', () => {
    let messageId = requestMessageSend(user.token, channel.channelId, "Message3");
    expect(requestMessageEdit(user.token, messageId.messageId , "New Message")).toStrictEqual({});
  });

  test('Successful case - user is owner but not sender', () => {
    requestChannelJoin(user2.token, channel.channelId); 
    let messageId = requestMessageSend(user2.token, channel.channelId, "Message3");

     expect(requestMessageEdit(user.token, messageId.messageId , "New Message")).toStrictEqual({});
  });
  
  test('Invalid case - invalid Token', () => {
    let messageId = requestMessageSend(user.token, channel.channelId, "Message3");
    expect(requestMessageEdit("user.token", messageId.messageId , "New Message")).toStrictEqual({error: expect.any(String) });
  });

  test('Invalid case - invalid messageId', () => {
    let messageId = requestMessageSend(user.token, channel.channelId, "Message3");
    let invalidMessageId = messageId.messageId + 1; 
    expect(requestMessageEdit(user.token, invalidMessageId , "New Message")).toStrictEqual({error: expect.any(String)});
  });

  test('Invalid case - invalid userID and user is not owner', () => {
    let messageId = requestMessageSend(user.token, channel.channelId, "Message3");
 
    expect(requestMessageEdit(user2.token, messageId.messageId , "New Message")).toStrictEqual({error: expect.any(String)});
  });

  test('Invalid message lengths', () => {
    let longString: string;
    for (let i = 0; i <= 1000; i++) {
      longString += 'a';
    }

  expect(requestMessageSend(user.token, channel.channelId, longString)).toStrictEqual({ error: expect.any(String) });

  });
});
