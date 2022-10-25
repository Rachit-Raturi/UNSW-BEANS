import { 
  requestauthRegister,
  requestauthLogin,
  requestChannelsCreate,
  requestChannelDetails,
  requestClear
} from './helper';

describe('Test for ClearV1', () => {
  test('Valid test', () => {
    const user = requestauthRegister('person@gmail.com', 'password', 'firstname', 'lastname');
    const channel = requestChannelsCreate(user.token, 'channel', false);
    const channel1 = requestChannelsCreate(user.token, 'channel1', true);
    requestClear();
    expect(requestauthLogin('person@gmail.com', 'password'))
      .toEqual({ error: expect.any(String) });
    expect(requestChannelDetails(user.token, channel.channelId))
      .toEqual({ error: expect.any(String) });
    expect(requestChannelDetails(user.token, channel1.channelId))
      .toEqual({ error: expect.any(String) });
  });
});
