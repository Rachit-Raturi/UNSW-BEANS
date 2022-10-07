channelMessages:
- I have assumed that should start be less than 0, it is trying to index past the most recent message. Thus as the most recent message is given the index 0, and subsequent messages are + 1 indexed, I have assumed that an error will occur.

channelsListAll: + ChannelsList:
- no specified output for when a valid user is not in any channels. Decided to return the empty channels array

channelDetails:
- stores authuids in channels array and when given an authuserId accesses the users array to find user details. This assumes that the authuId of the user will not change

channelDetails:
- as with the above point, by assuming that authuids won't change it allows the user to change their details without needing to go back through the channels array to change details. This assumes that a user may want to change their details such as their name or email