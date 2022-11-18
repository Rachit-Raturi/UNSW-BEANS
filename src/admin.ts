import { getData, setData } from './dataStore';
import { validToken, validUId, findUser } from './helperfunctions'
import HTTPError from 'http-errors';

/**
 * Given a user by their uId, removes them from the Beans. This means they should be removed
 * from all channels/DMs, and will not be included in the array of users returned by users/all.
 * Beans owners can remove other Beans owners (including the original first owner). Once a user
 * is removed, the contents of the messages they sent will be replaced by 'Removed user'. Their
 * profile must still be retrievable with user/profile, however nameFirst should be 'Removed' and
 * nameLast should be 'user'. The user's email and handle should be reusable.
 *
 * @param {number} - uId - uId of the user to be removed
 * @param {string} - token - the token of the user trying to remove another user
 */
function adminUserRemoveV1(uId: number, token: string) {
  let data = getData();

  if (!validToken(token)) {
    throw HTTPError(403, 'Invalid token has been inputted');
  }

  const globalOwner = findUser(token);

  if (globalOwner.globalPermission !== 1) {
    throw HTTPError(403, 'Authorised user is not a global owner');
  }

  if (!validUId(uId)) {
    throw HTTPError(400, 'userId entered is not valid');
  }

  let counter = 0;

  for (const users of data.users) {
    if (users.globalPermission === 1 && users.uId !== uId) {
      counter++;
    }
  }

  if (counter === 0) {
    throw HTTPError(400, 'userId refers to the only global owner')
  }
  
  for (const users of data.users) {
    if (users.uId === uId) {
      users.isRemoved = true;
      users.nameFirst = 'Removed';
      users.nameLast = 'user';
      users.channelsJoined = [];
      users.dmsJoined = [];
    }
  }

  for (const channels of data.channels) {
    if (channels.allMembers.includes(uId)) {
      for (const messages of channels.messages) {
        if (messages.uId === uId) {
          messages.message = 'Removed';
        }
      }
    }
  }

  for (const dms of data.dms) {
    if (dms.members.includes(uId)) {
      for (const messages of dms.messages) {
        if (messages.uId === uId) {
          messages.message = 'Removed';
        }
      }
    }
  }

  setData(data);
  return {};
}

/**
 * Given a user by their uID, sets their permissions to new permissions described
 * by permissionId.
 *
 * @param {number} - uId - uId of the user whose permissions are changing
 * @param {number} - permissionId - new permissions being put upon the user
 * @param {string} - token - token of the user changing anothers permissions
 */
function adminUserPermissionChangeV1(uId: number, permissionId: string, token: string) {
  let data = getData();

  if (!validToken(token)) {
    throw HTTPError(403, 'Invalid token has been inputted');
  }
  
  const globalOwner = findUser(token);

  if (globalOwner.globalPermission !== 1) {
    throw HTTPError(403, 'Authorised user is not a global owner');
  }

  let counter = 0;

  if (!validUId(uId)) {
    throw HTTPError(400, 'uId entered is not valid')
  }

  for (const users of data.users) {
    if (users.globalPermission === 1 && users.uId !== uId) {
      counter++;
    }
  }

  if (counter === 0 && permissionId !== 1) {
    throw HTTPError(400, 'userId refers to the only global owner')
  }

  if (permissionId !== 1 && permissionId !== 2) {
    throw HTTPError(400, 'permissionId is invalid')
  }

  for (const users of data.users) {
    if (users.uId === uId) {
      users.globalPermission = permissionId;
      setData(data);
      return {};
    }
  }
}

export { adminUserPermissionChangeV1, adminUserRemoveV1 };