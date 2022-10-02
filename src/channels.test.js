import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import { authRegisterV1, authLoginV1 } from './auth';
import { channelJoinV1, channelInviteV1, channelDetailsV1, channelMessagesV1 } from './channel';
import { getData, setData } from './dataStore';
import ClearV1 from './other';

beforeEach(() => {
    ClearV1();
});

describe('Invalid channelsListV1', () => {
  test('Invalid authUserId - no users', () => {
    expect(channelsListV1(1)).toStrictEqual({error: expect.any(String)});
  });

  test('Invalid authUserId - 1 user', () => {
    const userId = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
    let invaliduserId = 1;

    if (userId.authUserId === 1) {
      invaliduserId = 2;
    }
    
    expect(channelsListV1(invaliduserId)).toStrictEqual({error: expect.any(String)});
  });

  test('Invalid authUserId - multiple users', () => {
    const userId = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
    const userId1 = authRegisterV1('test1@gmail.com', 'Password', 'firstname1', 'lastname1');
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
    const userId = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
    const channel1 = channelsCreateV1(userId.authUserId,'test1',true);

    const outputarray = [];
    outputarray.push({channelId: channel1.channelId, name: 'My Channel1'});

    let expectedset = new Set(outputarray);
    let recievedset = new Set(channelsListV1(userId.authUserId).channels);

    expect(recievedset).toStrictEqual(expectedset);
  });

  test('test 1 user in 2 courses', () => {
    const userId = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
    const channel1 = channelsCreateV1(userId.authUserId,'test1',true);
    const channel2 = channelsCreateV1(userId.authUserId,'test2',true);

    const outputarray = [];
    outputarray.push({channelId: channel1.channelId, name: 'My Channel1'});
    outputarray.push({channelId: channel2.channelId, name: 'My Channel2'});

    let expectedset = new Set(outputarray);
    let recievedset = new Set(channelsListV1(userId.authUserId).channels);

    expect(recievedset).toStrictEqual(expectedset);
  });

  test('test 1 user in multiple courses', () => {
    const userId = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
    const channel1 = channelsCreateV1(userId.authUserId,'test1',true);
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

describe('tests for channelsListAllV1 function', () => { 
  test('test 1: authUserId is invalid ', () => {
    ClearV1(); 
    expect(channelsListAllV1("N/A")).toEqual({error:"authUserId is invalid"}); 
  });
}); 