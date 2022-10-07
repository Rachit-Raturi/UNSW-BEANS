```javascript
let data = {
  users: [
    {
      uId: 0,
      email: 'bot@hotmail.com',
      password: '12345',
      nameFirst: 'Beep',
      nameLast: 'Boop',
      handleStr: 'beepboop',
    },
    {
      uId: 1,
      email: 'robot@gmail.com',
      password: 'qwerty',
      nameFirst: 'Beep',
      nameLast: 'Boop',
      handleStr: 'beepboop0',
    },
    {
      uId: 2,
      email: 'random@outlook.com',
      password: 'a8#r2fah51sD',
      nameFirst: 'this-is@-very',
      nameLast: 'ab%l0ne',
      handleStr: 'thisisveryablne',
    },
    {
      uId: 3,
      email: 'sumeru@gmail.com',
      password: 'hEter0chTom@tic',
      nameFirst: 'Candace',
      nameLast: 'Deshret',
      handleStr: 'candacedeshret',
    },
  ],
  channels: [
    { channelId: 0,
      name: 'bot chat',
      isPublic: false,
      ownerMembers: [0],
      allMembers: [1],
    },
    { channelId: 1,
      name: `don't ask`,
      isPublic: true,
      ownerMembers: [3],
      allMembers: [0,1,2],
    },
    { channelId: 2,
      name: 'random memes',
      isPublic: true,
      ownerMembers: [2],
      allMembers: [0,3,1],
    },
  ],
  messages: [
  ]
}
```

[Optional] short description: 