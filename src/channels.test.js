import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import { authRegisterV1, authLoginV1 } from './auth';
import { channelJoinV1, channelInviteV1, channelDetailsV1, channelMessagesV1 } from './channel';
import ClearV1 from './other';

let userId;
let userId1;
let channel1; 

beforeEach(() => {
  ClearV1();
  userId = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
  userId1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  channel1 = channelsCreateV1(userId.authUserId,'test',true);
});
/*
describe('tests for channelsCreateV1 function', () => { 
  test('test 1: authUserId is invalid ', () => {
 
    let invaliduserId = 1;
    if (userId.authUserId === 1) {
      invaliduserId = 2;
    }

    expect(channelsCreateV1(invaliduserId, "channel1", true)).toStrictEqual({error: expect.any(String)});
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
    expect(channelsListV1(1)).toStrictEqual({error: expect.any(String)});
  });

  test('Invalid authUserId - 1 user', () => {
    let invaliduserId = 1;

    if (userId.authUserId === 1) {
      invaliduserId = 2;
    }
    
    expect(channelsListV1(invaliduserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Invalid authUserId - multiple users', () => {
    let invaliduserId = 1;

    if (userId.authUserId === 1 || userId1.authUserId === 1) {
      invaliduserId = 2;
    }
    
    if (userId.authUserId === 2 || userId1.authUserId === 2) {
      invaliduserId = 3;
    }
    
    expect(channelsListV1(a)).toStrictEqual({error: expect.any(String)});
  });
});

describe('Valid channelsListV1', () => {
  
  test('test 1 user in 1 course', () => {

    const outputarray = [];
    outputarray.push({channelId: channel1.channelId, name: 'My Channel1'});

    let expectedset = new Set(outputarray);
    let recievedset = new Set(channelsListV1(userId.authUserId).channels);

    expect(recievedset).toStrictEqual(expectedset);
  });

  test('test 1 user in 2 courses', () => {
    const channel2 = channelsCreateV1(userId.authUserId,'test2',true);

    const outputarray = [];
    outputarray.push({channelId: channel1.channelId, name: 'My Channel1'});
    outputarray.push({channelId: channel2.channelId, name: 'My Channel2'});

    let expectedset = new Set(outputarray);
    let recievedset = new Set(channelsListV1(userId.authUserId).channels);

    expect(recievedset).toStrictEqual(expectedset);
  });

  test('test 1 user in multiple courses', () => {
    const channel2 = channelsCreateV1(userId.authUserId,'test2',true);
    const channel3 = channelsCreateV1(userId.authUserId,'test3',true);

    const outputarray = [];
    outputarray.push({channelId: channel1.channelId, name: 'My Channel1'});
    outputarray.push({channelId: channel2.channelId, name: 'My Channel2'});
    outputarray.push({channelId: channel3.channelId, name: 'My Channel3'});

    let expectedset = new Set(outputarray);
    let recievedset = new Set(channelsListV1(userId.authUserId).channels);

    expect(recievedset).toStrictEqual(expectedset);
  });
});
*/
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
    const channel2 = channelsCreateV1(userId.authUserId,'My Channel2',true);
    const channel3 = channelsCreateV1(userId.authUserId,'My Channel3',true);

    const outputarray = [];
    outputarray.push({channelId: channel1.channelId, name: 'test'});
    outputarray.push({channelId: channel2.channelId, name: 'My Channel2'});
    outputarray.push({channelId: channel3.channelId, name: 'My Channel3'});

    let expectedset = outputarray
    let recievedset = channelsListAllV1(userId.authUserId)

    expect(expectedset).toStrictEqual(recievedset);
  });

  test('test 3: Valid Case - 6 channels', () => {
    const channel2 = channelsCreateV1(userId.authUserId,'My Channel2',true);
    const channel3 = channelsCreateV1(userId.authUserId,'My Channel3',true);
    const channel4 = channelsCreateV1(userId.authUserId,'My Channel4',true);
    const channel5 = channelsCreateV1(userId.authUserId,'My Channel5',true);
    const channel6 = channelsCreateV1(userId.authUserId,'My Channel6',true);
    const channel7 = channelsCreateV1(userId.authUserId,'My Channel7',true);

    const outputarray = [];
    outputarray.push({channelId: channel1.channelId, name: 'test'});
    outputarray.push({channelId: channel2.channelId, name: 'My Channel2'});
    outputarray.push({channelId: channel3.channelId, name: 'My Channel3'});
    outputarray.push({channelId: channel4.channelId, name: 'My Channel4'});
    outputarray.push({channelId: channel5.channelId, name: 'My Channel5'});
    outputarray.push({channelId: channel6.channelId, name: 'My Channel6'});
    outputarray.push({channelId: channel7.channelId, name: 'My Channel7'});

    let expectedset = outputarray
    let recievedset = channelsListAllV1(userId.authUserId)

    expect(expectedset).toStrictEqual(recievedset);
  });
}); 