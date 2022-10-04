```javascript
let data = {
  users: [
    {
      authUserId: 1,
      email: 'bot@hotmail.com',
      password: '12345',
      nameFirst: 'Beep',
      nameLast: 'Boop',
      userHandle: 'beepboop',
    },
    {
      authUserId: 2,
      email: 'robot@gmail.com',
      password: 'qwerty',
      nameFirst: 'Beep',
      nameLast: 'Boop',
      userHandle: 'beepboop0',
    },
    {
      authUserId: 3,
      email: 'random@outlook.com'
      password: 'a8#r2fah51sD',
      nameFirst: 'this-is@-very',
      nameLast: 'ab%l0ne',
      userHandle: 'thisisveryablne',
    },
    {
      authUserId: 4,
      email: 'sumeru@gmail.com',      
      password: 'hEter0chTom@tic',
      nameFirst: 'Candace',
      nameLast: 'Deshret',
      userHandle: 'candacedeshret',
    },
  ],
  channels: [
    { channelId: 1,
      name: 'bot chat',
      isPublic: false,
      owners: [1],
      members: [2],
      messages: [],
    },
    { channelId: 2,
      name: `don't ask`,
      isPublic: true,
      owners: [4],
      members: [1,2,3],
      messages: [],
    }
    { channelId: 3,
      name: 'radom memes',
      isPublic: true,
      owners: [3],
      members: [1,4],
      messages: [],
    }
  ]
}
```

[Optional] short description: 