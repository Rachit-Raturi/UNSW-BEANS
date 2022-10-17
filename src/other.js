import { setData } from './dataStore.js';

/**
 * Completely resets the datastore
 *
 * @returns {}
 */

function clearV1() {
  const clearedData = {
    users: [
    ],
    channels: [
    ],
    messages: [

    ],
  };

  setData(clearedData);
  return {};
}

export { clearV1 };
