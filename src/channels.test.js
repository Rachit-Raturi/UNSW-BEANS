import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels.js';
import { authRegisterV1, authLoginV1 } from './auth.js';
import { channelJoinV1, channelInviteV1, channelDetailsV1, channelMessagesV1 } from './channel.js';
import ClearV1 from './other.js';

let userId;
let userId1;
let channel1; 

beforeEach(() => {
  ClearV1();
  userId = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
  userId1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  channel1 = channelsCreateV1(userId.authUserId,'Channel1',true);
});

describe('tests for channelsCreateV1 function', () => { 
  test('test 1: authUserId is invalid ', () => {
 
    let invaliduserId = 1;
    
    if (userId.authUserId === 1 || userId1.authUserId === 1) {
      invaliduserId = 2;
    }
    
    if (userId.authUserId === 2 || userId1.authUserId === 2) {
      invaliduserId = 3;
    }

    expect(channelsCreateV1(invaliduserId, "Channel1", true)).toStrictEqual({error: expect.any(String)});
  });

  test('test 2: name is greater then 20 characters', () => {
    expect(channelsCreateV1(userId.authUserId , "GreaterThentwentyCharacters", false)).toStrictEqual({error: expect.any(String)});
  });

  test('test 3: name is less then 1 ', () => {
    expect(channelsCreateV1(userId.authUserId , "", false)).toStrictEqual({error: expect.any(String)});
  });
}); 

describe('Invalid channelsListV1', () => {
  test('Invalid authUserId - no users', () => {
    ClearV1();
    expect(channelsListV1(1)).toStrictEqual({error: expect.any(String)});
  });

  test('Invalid authUserId - multiple users', () => {
    let invaliduserId = 1;

    if (userId.authUserId === 1 || userId1.authUserId === 1) {
      invaliduserId = 2;
    }
    
    if (userId.authUserId === 2 || userId1.authUserId === 2) {
      invaliduserId = 3;
    }
    
    expect(channelsListV1(invaliduserId)).toStrictEqual({error: expect.any(String)});
  });
});

describe('Valid channelsListV1', () => {
  
  test('test 1 user in 1 course', () => {

    const outputarray = [];
    outputarray.push({channelId: channel1.channelId, name: 'Channel1'});

    let expectedset = new Set(outputarray);
    let recievedset = new Set(channelsListV1(userId.authUserId).channels);

    expect(recievedset).toStrictEqual(expectedset);
  });

  test('test 1 user in 2 courses', () => {
    const channel2 = channelsCreateV1(userId.authUserId,'Channel2',true);

    const outputarray = [];
    outputarray.push({channelId: channel1.channelId, name: 'Channel1'});
    outputarray.push({channelId: channel2.channelId, name: 'Channel2'});

    let expectedset = new Set(outputarray);
    let recievedset = new Set(channelsListV1(userId.authUserId).channels);

    expect(recievedset).toStrictEqual(expectedset);
  });

  test('test 1 user in multiple courses', () => {
    const channel2 = channelsCreateV1(userId.authUserId,'Channel2',true);
    const channel3 = channelsCreateV1(userId.authUserId,'Channel3',true);

    const outputarray = [];
    outputarray.push({channelId: channel1.channelId, name: 'Channel1'});
    outputarray.push({channelId: channel2.channelId, name: 'Channel2'});
    outputarray.push({channelId: channel3.channelId, name: 'Channel3'});

    let expectedset = new Set(outputarray);
    let recievedset = new Set(channelsListV1(userId.authUserId).channels);

    expect(recievedset).toStrictEqual(expectedset);
  });
});

describe('tests for channelsListAllV1 function', () => { 
  test('test 1: authUserId is invalid ', () => {
 
    let invaliduserId = 1;
    if (userId.authUserId === 1) {
      invaliduserId = 2;
    }
    if (userId1.authUserId === invaliduserId) { 
      invaliduserId = 3;
    }

    expect(channelsListAllV1(invaliduserId)).toStrictEqual({error: expect.any(String)});
  });

  test('test 2: Valid Case - 3 channels', () => {
    const channel2 = channelsCreateV1(userId.authUserId,'Channel2',true);
    const channel3 = channelsCreateV1(userId.authUserId,'Channel3',true);

    const outputarray = [];
    outputarray.push({channelId: channel1.channelId, name: 'Channel1'});
    outputarray.push({channelId: channel2.channelId, name: 'Channel2'});
    outputarray.push({channelId: channel3.channelId, name: 'Channel3'});

    let expectedset = new Set(outputarray);
    let recievedset = new Set(channelsListAllV1(userId.authUserId).channels);

    expect(expectedset).toStrictEqual(recievedset);
  });

  test('test 3: Valid Case - 6 channels', () => {
    const channel2 = channelsCreateV1(userId.authUserId,'Channel2',true);
    const channel3 = channelsCreateV1(userId.authUserId,'Channel3',true);
    const channel4 = channelsCreateV1(userId.authUserId,'Channel4',true);
    const channel5 = channelsCreateV1(userId.authUserId,'Channel5',true);
    const channel6 = channelsCreateV1(userId.authUserId,'Channel6',true);
    const channel7 = channelsCreateV1(userId.authUserId,'Channel7',true);

    const outputarray = [];
    outputarray.push({channelId: channel1.channelId, name: 'Channel1'});
    outputarray.push({channelId: channel2.channelId, name: 'Channel2'});
    outputarray.push({channelId: channel3.channelId, name: 'Channel3'});
    outputarray.push({channelId: channel4.channelId, name: 'Channel4'});
    outputarray.push({channelId: channel5.channelId, name: 'Channel5'});
    outputarray.push({channelId: channel6.channelId, name: 'Channel6'});
    outputarray.push({channelId: channel7.channelId, name: 'Channel7'});

    let expectedset = new Set(outputarray);
    let recievedset = new Set(channelsListAllV1(userId.authUserId).channels);

    expect(expectedset).toStrictEqual(recievedset);
  });
}); 
