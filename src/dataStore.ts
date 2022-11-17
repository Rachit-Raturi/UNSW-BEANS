// YOU SHOULD MODIFY THIS OBJECT BELOW
import { Datastore } from './interface';

let data: Datastore = {
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

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: Datastore) {
  data = newData;
}

export { getData, setData };
