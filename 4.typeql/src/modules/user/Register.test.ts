import { Connection } from 'typeorm';
import { testConn } from '../../test-utils/testConn';
import { gCall } from '../../test-utils/gCall';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation Register($input: RegisterInput!){
  register(
    input: $input
  ) {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe('Register', () => {
  it('create user', async () => {
    console.log(
      await gCall({
        source: registerMutation,
        variableValues: {
          input: {
            firstName: 'matest',
            lastName: 'ramirest',
            email: 'matest@hotmail.com',
            password: '12345',
          },
        },
      })
    );
  });
});
