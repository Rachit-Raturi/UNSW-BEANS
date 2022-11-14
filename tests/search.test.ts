import {
  requestClear,
  requestAuthRegister,
  requestChannelsCreate,
  requestDmCreate,
  requestSearch,
  requestMessageSend,
  requestMessageSendDm
} from './helper';

interface userType {
  token: string,
  authUserId: number
}

let invalidToken = 'invalid';
let user: userType;

beforeEach(() => {
  requestClear();
  user = requestAuthRegister('test@gmail.com', 'password', 'firstname', 'lastname');

  if (user.token === invalidToken) {
    invalidToken = 'invalid1';
  }
});

describe('/search/v1', () => {
  describe('Error tests', () => {
    test('test 1: invalid token', () => {
      expect(requestSearch(invalidToken, 'yellow')).toStrictEqual(403);
    });
    test('test 2: invalid querystr length', () => {
      expect(requestSearch(user.token, '')).toStrictEqual(400);

      let longString: string;
      for (let i = 0; i <= 1200; i++) {
        longString += 'a';
      }

      expect(requestSearch(user.token, longString)).toStrictEqual(400);
    });
  });

  test('test 1: valid test', () => {
    const channel = requestChannelsCreate(user.token, 'channel', true);
    const dm = requestDmCreate(user.token, []);
    requestMessageSend(user.token, channel.channelId, 'This is the alphabet, ABCDEZ.');
    requestMessageSend(user.token, channel.channelId, 'Send another message');
    requestMessageSend(user.token, channel.channelId, 'thisisamessage');
    requestMessageSendDm(user.token, dm.dmId, 'This is the alphabet, ABCDEZ.');
    requestMessageSendDm(user.token, dm.dmId, 'Send another message');
    requestMessageSendDm(user.token, dm.dmId, 'thisisamessage');

    expect((requestSearch(user.token, 'message').messages).length).toStrictEqual(4);
  });

  test('test 2: not checking messages in channels/dms that user has not joined', () => {
    const user1 = requestAuthRegister('test1@gmail.com', 'password1', 'firstname1', 'lastname1');
    const channel = requestChannelsCreate(user.token, 'channel', true);
    const channel1 = requestChannelsCreate(user1.token, 'channel1', false);
    const dm = requestDmCreate(user.token, []);
    const dm1 = requestDmCreate(user1.token, []);
    requestMessageSend(user.token, channel.channelId, 'This is the alphabet, ABCDEZ.');
    requestMessageSend(user1.token, channel1.channelId, 'do not check this message');
    requestMessageSend(user.token, channel.channelId, 'dsaafmessagesakdjla');
    requestMessageSendDm(user.token, dm.dmId, 'This is the alphabet, ABCDEZ.');
    requestMessageSendDm(user1.token, dm1.dmId, 'Send another message which should not show up');
    requestMessageSendDm(user.token, dm.dmId, 'thisisamessage');

    expect((requestSearch(user.token, 'message').messages).length).toStrictEqual(2);
  });
});
