import { getData, setData } from './dataStore.js';

function clearV1() {
let clearedData = {
      users: [
      ],
      channels: [
      ],
    };

    setData(clearedData);
}

export default clearV1;
