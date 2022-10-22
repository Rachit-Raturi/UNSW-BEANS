import { setData } from './dataStore';

/**
 * Completely resets the datastore
 *
 * @returns {}
 */

function clearV1() {
  const clearedData = {
    users: [],
    channels: [],
    dms: [],
  };

  setData(clearedData);
  return {};
}

export { clearV1 };
