// YOU SHOULD MODIFY THIS OBJECT BELOW
let data = {
  users:
  [

  ],
  channels:
  [

  ],
  dms:
  [

  ],
};

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1
/*
// Example data structure

  Users: [
    uId: number
    email: string
    password: string
    nameFirst: string
    nameLast: string
    handleStr: string
    tokens: [
      token: string
    ]
  ]
  
  Channels: [
    channelId: number
    name: string
    allMembers: [users]
    allOwners: [users]
    isPublic: boolean
    messages: [
      { 
        messageId: number
        uId : number
        message: string
        timeSent: date
      }
    ]
  ]

  dms: [
    dmId: number
    name: string
    owner: user
    members: [users]
    messages: [
      { 
        messageId: number
        uId : number
        message: string
        timeSent: date
      }
    ]
  ]
*/

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
function setData(newData) {
  data = newData;
}

export { getData, setData };
