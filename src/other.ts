import { setData } from './dataStore';
import { resetId } from './message';
import { Datastore } from './interface';
/**
 * Completely resets the datastore
 *
 * @returns {}
 */

function clearV1() {
  resetId();
  const clearedData: Datastore = {
    users: [],
    uIdGen: 0,
    channels: [],
    dms: [],
    stats: {
      channelsExist: [{ numChannelsExist: 0, timeStamp: 0 }],
      dmsExist: [{ numDmsExist: 0, timeStamp: 0 }],
      messagesExist: [{ numMessagesExist: 0, timeStamp: 0 }],
    }
  };

  setData(clearedData);
  return {};
}

export { clearV1 };
