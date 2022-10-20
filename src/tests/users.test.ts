// import { authRegisterV1, authLoginV1 } from '../auth';
// import { userProfileV1 } from '../users';
// import { clearV1 } from '../other';

// import request from 'sync-request';
// import { port, url } from '../config.json'

// const SERVER_URL = `${url}:${port}`;

// let user;
// let invalid_id = 1;
// const errorMessage: object = {error: expect.any(String)};

// function requestuserprofilesetname(token: string, nameFirst: string, nameLast: string) {
//   const res = request(
//     'PUT',
//     SERVER_URL + 'user/profile/setname/v1',
//     {
//       json: {
//         token, nameFirst, nameLast
//       }
//     }
//   );
//   return JSON.parse(res.getBody() as string);
// }

// function requestuserprofilesetemail(token: string, email: string) {
//   const res = request(
//     'PUT',
//     SERVER_URL + 'user/profile/setemail/v1',
//     {
//       json: {
//         token, email
//       }
//     }
//   );
//   return JSON.parse(res.getBody() as string);
// }

// function requestusersall(token: number) {
//   const res = request(
//     'GET',
//     SERVER_URL + 'users/all/v1',
//     {
//       qs: {
//         token
//       }
//     }
//   );
//   return JSON.parse(res.getBody() as string);
// }

// function requestuserprofilesethandle(token: string, handleStr: string) {
//   const res = request(
//     'PUT',
//     SERVER_URL + 'user/profile/sethandle/v1',
//     {
//       json: {
//         token, handleStr
//       }
//     }
//   );
//   return JSON.parse(res.getBody() as string);
// }

// beforeEach(() => {
//   clearV1();
//   user = authRegisterV1('test@gmail.com', 'password', 'firstname', 'lastname');
//   if (user.authUserId === 1) {
//     invalid_id === 2;
//   }
// });

// describe('error tests for UserProfileV1', () => {
//     test('test 1: invalid authuserid', () => {
//       expect(userProfileV1(invalid_id, user.authUserId))
//                                     .toStrictEqual({error: expect.any(String)});
//     });
//     test('test 2: invalid uId', () => {
//       expect(userProfileV1(user.authUserId, invalid_id))
//                                     .toStrictEqual({error: expect.any(String)});
//     });
// });

// describe('valid test for UserProfileV1', () => {
//   test('test 1: valid authuserid', () => {
//     let user1 = authRegisterV1('test1@gmail.com', 'password1', 'firstname1',
//                                                                 'lastname1');
//     expect(userProfileV1(user.authUserId, user1.authUserId)).toStrictEqual(
//       {
//         user: {
//           uId: user1.authUserId,
//           email: 'test1@gmail.com',
//           nameFirst: 'firstname1',
//           nameLast: 'lastname1',
//           handleStr: 'firstname1lastname1',
//         }
//       }
//     );
//   });
// });

// describe('tests for user/profile/setemail/v1', () => {
//   test('invalid email', () => {
//     /* call authregister with a
//     user: {
//       uId: user1.authUserId,
//       email: 'test1@gmail.com',
//       nameFirst: 'firstname1',
//       nameLast: 'lastname1',
//       handleStr: 'firstname1lastname1',
//       token: string
//     }
//     */
//     expect(requestuserprofilesetemail(/*tokenplaceholder*/, 'invalidemail')).toStrictEqual(errorMessage);
//   });

//   test('same email entered', () => {
//     expect(requestuserprofilesetemail(/*tokenplaceholder*/, 'test1@gmail.com')).toStrictEqual(errorMessage);
//   });

//   test('email used by another user', () => {
//         /*additionally call authregister with a
//     user: {
//       uId: user2.authUserId,
//       email: 'test2@gmail.com',
//       nameFirst: 'firstname1',
//       nameLast: 'lastname1',
//       handleStr: 'firstname1lastname1',
//       token: string
//     }
//     */
//     expect(requestuserprofilesetemail(/*tokenplaceholder*/, 'test2@gmail.com')).toStrictEqual(errorMessage);
//   });

//   test('invalid token', () => {
//     expect(requestuserprofilesetemail(/*invalidtokenplaceholder*/, 'test1@gmail.com')).toStrictEqual(errorMessage);
//   });

//   test('valid input', () => {
//     expect(requestuserprofilesetemail(/*tokenplaceholder*/, 'test999@gmail.com')).toStrictEqual({});
//   });

// });

// describe('tests for user/profile/setname/v1', () => {
//   test('invalid nameFirst length', () => {
//     /* call authregister with a
//     user: {
//       uId: user1.authUserId,
//       email: 'test1@gmail.com',
//       nameFirst: 'firstname1',
//       nameLast: 'lastname1',
//       handleStr: 'firstname1lastname1',
//       token: string
//     }
//     */
//     expect(requestuserprofilesetname(/*tokenplaceholder*/, '', 'apples')).toStrictEqual(errorMessage);
//     expect(requestuserprofilesetname(/*tokenplaceholder*/, 'abcdefgHiAjSjoWjoDAWojdsodasdjodaowapdoapcdwocwapdaowdj', 'apples')).toStrictEqual(errorMessage);
//   });

//   test('invalid nameLast length', () => {
//     expect(requestuserprofilesetname(/*tokenplaceholder*/, 'apples', '')).toStrictEqual(errorMessage);
//     expect(requestuserprofilesetname(/*tokenplaceholder*/, 'apples', 'abcdefgHiAjSjoWjoDAWojdsodasdjodaowapdoapcdwocwapdaowdj')).toStrictEqual(errorMessage);
//   });

//   test('invalid token', () => {
//     expect(requestuserprofilesetname(/*invalidtokenplaceholder*/, 'apples', 'oranges')).toStrictEqual(errorMessage);
//   });

//   test('valid input', () => {
//     expect(requestuserprofilesetname(/*tokenplaceholder*/, 'apples', 'oranges')).toStrictEqual({});
//   });

// });

// describe('tests for user/profile/sethandle/v1', () => {
//   test('invalid handleStr length', () => {
//     /* call authregister with a
//     user: {
//       uId: user1.authUserId,
//       email: 'test1@gmail.com',
//       nameFirst: 'firstname1',
//       nameLast: 'lastname1',
//       handleStr: 'firstname1lastname1',
//       token: string
//     }
//     */
//     expect(requestuserprofilesethandle(/*tokenplaceholder*/, 'overtwentycharactersincl')).toStrictEqual(errorMessage);
//     expect(requestuserprofilesethandle(/*tokenplaceholder*/, 'be')).toStrictEqual(errorMessage);
//   });

//   test('same handleStr', () => {
//     expect(requestuserprofilesethandle(/*tokenplaceholder*/, 'firstname1lastname1')).toStrictEqual(errorMessage);
//   });

//   test('handleStr already used', () => {
//     /* call authregister with a
//     user: {
//       uId: user2.authUserId,
//       email: 'test2@gmail.com',
//       nameFirst: 'firstname2',
//       nameLast: 'lastname2',
//       handleStr: 'firstname2lastname2',
//       token: string
//     }
//     */

//     expect(requestuserprofilesethandle(/*tokenplaceholder for user1*/, 'firstname2lastname2')).toStrictEqual(errorMessage);
//   });

//   test('invalid characters', () => {
//     expect(requestuserprofilesethandle(/*tokenplaceholder*/, '%invalid_handle$')).toStrictEqual(errorMessage);
//   });

//   test('invalid token', () => {
//     expect(requestuserprofilesethandle(/*invalidtokenplaceholder*/, 'firstname1lastname1')).toStrictEqual(errorMessage);
//   });

//   test('valid input', () => {
//     expect(requestuserprofilesethandle(/*tokenplaceholder*/, 'givemeyourstring1')).toStrictEqual({});
//   });

// });

// describe('tests for users/all/v1', () => {
//   test('invalid token', () => {
//         /* call authregister with a
//         user: {
//       uId: user1.authUserId,
//       email: 'test1@gmail.com',
//       nameFirst: 'firstname1',
//       nameLast: 'lastname1',
//       handleStr: 'firstname1lastname1',
//       token: string
//     }
//     */

//     expect(requestusersall(/*invalidtokenplaceholder*/)).toStrictEqual(errorMessage);
//   });

//   test('valid input 1 user', () => {
//     expect(requestusersall(/*tokenplaceholder*/)).toStrictEqual(
//       {
//         users: [
//           {
//             uId: user1.authUserId,
//             email: 'test1@gmail.com',
//             nameFirst: 'firstname1',
//             nameLast: 'lastname1',
//             handleStr: 'firstname1lastname1',
//           }
//         ]
//       }
//     );
//   });

//   test('valid input multiple users', () => {
//     const outputarray = [];
//     outputarray.push(
//       {
//         uId: user1.authUserId,
//         email: 'test1@gmail.com',
//         nameFirst: 'firstname1',
//         nameLast: 'lastname1',
//         handleStr: 'firstname1lastname1',
//       }
//     )
//     outputarray.push(
//       {
//         uId: user2.authUserId,
//         email: 'test2@gmail.com',
//         nameFirst: 'firstname2',
//         nameLast: 'lastname2',
//         handleStr: 'firstname2lastname2',
//       }
//     )

//     const outputSet = new Set(outputarray);
//     const inputSet = new Set(requestusersall(/*tokenplaceholder*/).users);

//     expect(inputSet).toStrictEqual(outputSet);
//   });
// });
