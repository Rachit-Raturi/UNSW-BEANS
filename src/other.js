import { getData, setData} from './dataStore.js';

function ClearV1() {
  let clearedData = {
        users: [],
        channels: [],
      };

  setData(clearedData);
  return {};
}

export default ClearV1;
