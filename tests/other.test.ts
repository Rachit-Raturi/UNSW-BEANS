import { channelDetailsV1 } from '../channel';
import { channelsCreateV1 } from '../channels';
import { authRegisterV1, authLoginV1 } from '../auth';
import { clearV1 } from '../other';

describe('Test for ClearV1', () => {
  test('Valid test', () => {
    const user = authRegisterV1('person@gmail.com', 'password', 'firstname', 'lastname');
    const channel = channelsCreateV1(user.authUserId, 'channel', false);
    const channel1 = channelsCreateV1(user.authUserId, 'channel1', true);
    clearV1();
    expect(authLoginV1('person@gmail.com', 'password'))
      .toEqual({ error: expect.any(String) });
    expect(channelDetailsV1(user.authUserId, channel.channelId))
      .toEqual({ error: expect.any(String) });
    expect(channelDetailsV1(user.authUserId, channel1.channelId))
      .toEqual({ error: expect.any(String) });
  });
});
