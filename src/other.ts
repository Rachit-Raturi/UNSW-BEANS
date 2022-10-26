import { setData } from './dataStore';
import { resetId } from './message'
/**
 * Completely resets the datastore
 *
 * @returns {}
 */

function clearV1() {
  resetId()
  const clearedData = {
    users: [
    ],
    channels: [
    ],
    dms: [

    ],
  };

  setData(clearedData);
  return {};
}

export { clearV1 };
