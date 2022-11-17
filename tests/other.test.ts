import {
  requestClear,
  requestAuthRegister,
  requestAuthLogin,
  requestChannelsCreate,
  requestChannelDetails,
  requestDmCreate,
  requestDmDetails,
} from './helper';

describe('/clear/v1', () => {
  test('Valid test', () => {
    const user = requestAuthRegister('person@gmail.com', 'password', 'firstname', 'lastname');
    const channel = requestChannelsCreate(user.token, 'channel', false);
    const channel1 = requestChannelsCreate(user.token, 'channel1', true);
    const dm = requestDmCreate(user.token, []);
    requestClear();
    expect(requestAuthLogin('person@gmail.com', 'password')).toStrictEqual(400);
    expect(requestChannelDetails(user.token, channel.channelId)).toStrictEqual(403);
    expect(requestChannelDetails(user.token, channel1.channelId)).toStrictEqual(403);
    expect(requestDmDetails(user.token, dm.dmId)).toStrictEqual(403);
  });
});
