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
    channels: [],
    dms: [],
  };

  setData(clearedData);
  return {};
}

export { clearV1 };
