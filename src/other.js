import { getData, setData} from './dataStore.js';

function ClearV1() {
let clearedData = {
      users: [
      ],
      channels: [
      ],
    };

    setData(clearedData);
}

export default ClearV1;
