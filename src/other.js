import { getData, setData } from './dataStore.js';

function clearV1() {
let clearedData = {
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

export default clearV1;
