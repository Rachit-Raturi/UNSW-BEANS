channelMessages:
- We have assumed that should start be less than 0, it is trying to index past the most recent message. Thus as the most recent message is given the index 0, and subsequent messages are + 1 indexed, we have assumed that an error will occur.
- We have assumed that the returned value for start is the start value being passed into the function. As pagination takes in the start and increments it by 50 if there are more than 50 messages in the channel's history. This is just to document the number of messages from the start message through increments of 50.

channelsListAll: + ChannelsList:
- no specified output for when a valid user is not in any channels. Decided to return the empty channels array.

channelDetails:
- stores authuids in channels array and when given an authuserId accesses the users array to find user details. This assumes that the authuId of the user will not change.

channelDetails:
- as with the above point, by assuming that authuids won't change it allows the user to change their details without needing to go back through the channels array to change details. This assumes that a user may want to change their details such as their name or email.

authLogin:
- We have assumed that authLogin is not required to be successful or called before accessing any channel/s functions. The authUserId returned from authRegisterV1 is used for any future function calls.