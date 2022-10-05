import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import { authLoginV1, authRegisterV1 } from './auth';
import { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1 } from './channel';
import ClearV1 from './other';

let user;
let user1;
let channel1; 

beforeEach(() => {
  ClearV1();
  user = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
  user1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
  channel1 = channelsCreateV1(user.authUserId, 'My Channel1', true);
});

describe('Tests for channelsCreateV1', () => { 
  test('Test 1: Invalid authUserId', () => {
    let invalidUserId = 1;
    if (user.authUserId === 1) {
      invalidUserId = 2;
    }
    expect(channelsCreateV1(invalidUserId, 'channel1', true)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 2: Name is greater then 20 characters', () => {
    expect(channelsCreateV1(user.authUserId , 'GreaterThentwentyCharacters', false)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 3: Name is less then 1', () => {
    expect(channelsCreateV1(user.authUserId , '', false)).toStrictEqual({error: expect.any(String)});
  });
}); 



describe('Invalid channelsListV1 tests', () => {
  test('Test 1: Invalid authUserId - no users', () => {
    ClearV1();
    expect(channelsListV1(1)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 2: Invalid authUserId - multiple users', () => {
    let invalidUserId = 1;

    if (user.authUserId === 1 || user1.authUserId === 1) {
      invalidUserId = 2;
    }
    
    if (user.authUserId === 2 || user1.authUserId === 2) {
      invalidUserId = 3;
    }
    
    expect(channelsListV1(invalidUserId)).toStrictEqual({error: expect.any(String)});
  });
});

describe('Valid channelsListV1 tests', () => {
  test('Test 1: user in 1 course', () => {
    const outputArray = [];
    outputArray.push({channelId: channel1.channelId, name: 'My Channel1'});

    let expectedSet = new Set(outputArray);
    let receivedSet = new Set(channelsListV1(user.authUserId).channels);

    expect(receivedSet).toStrictEqual(expectedSet);
  });

  test('Test 2: user in 2 courses', () => {
    const channel2 = channelsCreateV1(user.authUserId,'My Channel2',true);

    const outputArray = [];
    outputArray.push({channelId: channel1.channelId, name: 'My Channel1'});
    outputArray.push({channelId: channel2.channelId, name: 'My Channel2'});

    let expectedSet = new Set(outputArray);
    let receivedSet = new Set(channelsListV1(user.authUserId).channels);

    expect(receivedSet).toStrictEqual(expectedSet);
  });

  test('Test 3: user in multiple courses', () => {
    const channel2 = channelsCreateV1(user.authUserId,'My Channel2',true);
    const channel3 = channelsCreateV1(user.authUserId,'My Channel3',true);

    const outputArray = [];
    outputArray.push({channelId: channel1.channelId, name: 'My Channel1'});
    outputArray.push({channelId: channel2.channelId, name: 'My Channel2'});
    outputArray.push({channelId: channel3.channelId, name: 'My Channel3'});

    let expectedSet = new Set(outputArray);
    let receivedSet = new Set(channelsListV1(user.authUserId).channels);

    expect(receivedSet).toStrictEqual(expectedSet);
  });
});