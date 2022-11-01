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
      tokens: [
        'botcode111',
        'botcode222',
      ],
    },
    {
      uId: 1,
      email: 'robot@gmail.com',
      password: 'qwerty',
      nameFirst: 'Beep',
      nameLast: 'Boop',
      handleStr: 'beepboop0',
      tokens: [
        'botcodeabc',
        'botcodeqqq',
      ],
    },
    {
      uId: 2,
      email: 'random@outlook.com',
      password: 'a8#r2fah51sD',
      nameFirst: 'this-is@-very',
      nameLast: 'ab%l0ne',
      handleStr: 'thisisveryablne',
      tokens: [
        'squid',
        'octopus',
        'starfish',
        'cow',
        'yes',
      ],
    },
    {
      uId: 3,
      email: 'sumeru@gmail.com',
      password: 'hEter0chTom@tic',
      nameFirst: 'Candace',
      nameLast: 'Deshret',
      handleStr: 'candacedeshret',
      tokens: [
        'loneliness',
      ],
    },
  ],
  channels: [
    { channelId: 0,
      name: 'bot chat',
      isPublic: false,
      ownerMembers: [0],
      allMembers: [1],
      messages: [

      ],
    },
    { channelId: 1,
      name: `don't ask`,
      isPublic: true,
      ownerMembers: [3],
      allMembers: [0,1,2],
      messages: [
        
      ],
    },
    { channelId: 2,
      name: 'random memes',
      isPublic: true,
      ownerMembers: [2],
      allMembers: [0,3,1],
      messages: [
        
      ],
    },
  ],
  dms: [
  ]
}
```

[Optional] short description: 