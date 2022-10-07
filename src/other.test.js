import { channelJoinV1, channelInviteV1, channelDetailsV1, channelMessagesV1 } from './channel.js';
import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels.js';
import { authRegisterV1, authLoginV1 } from './auth.js';
import {clearV1} from './other.js';

describe('test for ClearV1', () => {
  test('valid test', () => {
    let user = authRegisterV1('person@gmail.com', 'password', 'firstname','lastname');
    let channel = channelsCreateV1(user.authUserId,'channel',false);
    let channel1 = channelsCreateV1(user.authUserId,'channel1',true);
    clearV1();
    expect(authLoginV1('person@gmail.com', 'password')).toEqual({error: expect.any(String)});
    expect(channelDetailsV1(user.authUserId,channel.channelId)).toEqual({error: expect.any(String)});
    expect(channelDetailsV1(user.authUserId,channel.channel1Id)).toEqual({error: expect.any(String)});
  });
});