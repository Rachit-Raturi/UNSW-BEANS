import { authRegisterV1,
         channelsCreateV1,
         channelJoinV1,
         channelInviteV1,
         channelDetailsV1,
         channelMessagesV1 } from './channel';
import ClearV1 from './other';

beforeEach(() => {
  ClearV1();
});

describe('Tests for channelDetailsV1', () => {
  test('Test 1: Invalid channelId', () => {
    const user = authRegisterV1('valid.email@gmail.com', 'aGo0dpAssw0rD', 'Mike', 'Hox');
    const channel = channelsCreateV1(user.authUserId, 'Disney', true);
    expect(channelDetailsV1(user.authUserId, channel.channelId + 1)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 2: Invalid authUserId', () => {
    const user = authRegisterV1('valid.email@gmail.com', 'aGo0dpAssw0rD', 'Mike', 'Hox');
    const channel = channelsCreateV1(user.authUserId, 'Disney', true);
    expect(channelDetailsV1(user.authUserId + 1, channel.channelId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 3: User is not a member of the channel', () => {
    const authUser = authRegisterV1('valid.email@gmail.com', 'aGo0dpAssw0rD', 'Mike', 'Hox');
    const user = authRegisterV1('also.valid@yahoo.com.au', 'a83tt3rpW0rD', 'Barack', 'Obama');
    const channel = channelsCreateV1(authUser.authUserId, 'Disney', true);
    expect(channelDetailsV1(user.authUserId, channel.channelId)).toStrictEqual({error: expect.any(String)});
  });

  test('Test 4: Successful use of channelDetailsV1', () => {
    const user = authRegisterV1('valid.email@gmail.com', 'aGo0dpAssw0rD', 'Mike', 'Hox');
    const channel = channelsCreateV1(user.authUserId, 'Disney', true);
    expect(channelDetailsV1(user.authUserId, channel.channelId)).toStrictEqual({
      name: 'Disney',
      isPublic: true,
      ownerMembers: [
        {
          uId: user.authUserId,
          email: 'valid.email@gmail.com',
          nameFirst: 'Mike',
          nameLast: 'Hox',
        }
      ],
      allMembers: [
        {
          uId: user.authUserId,
          email: 'valid.email@gmail.com',
          nameFirst: 'Mike',
          nameLast: 'Hox',
        }
      ],
    });
  });
});