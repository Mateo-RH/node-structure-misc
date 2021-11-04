import { User } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { createResolver } from '../shared/createResolver';

export const CreateUserResolver = createResolver(
  'User',
  User,
  RegisterInput,
  User
);
