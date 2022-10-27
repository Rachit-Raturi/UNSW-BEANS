import {
  requestClear,
  requestAuthRegister,
  requestAuthLogin,
  requestChannelsCreate,
  requestChannelDetails
} from './helper';

const ERROR = { error: expect.any(String) };

describe('/clear/v1', () => {
  test('Valid test', () => {
    const user = requestAuthRegister('person@gmail.com', 'password', 'firstname', 'lastname');
    const channel = requestChannelsCreate(user.token, 'channel', false);
    const channel1 = requestChannelsCreate(user.token, 'channel1', true);
    requestClear();
    expect(requestAuthLogin('person@gmail.com', 'password')).toStrictEqual(ERROR);
    expect(requestChannelDetails(user.token, channel.channelId)).toStrictEqual(ERROR);
    expect(requestChannelDetails(user.token, channel1.channelId)).toStrictEqual(ERROR);
  });
});
