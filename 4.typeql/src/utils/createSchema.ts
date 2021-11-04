import { buildSchema } from 'type-graphql';
import { CreateUserResolver } from '../modules/user/CreateUser.resolver';
import { ChangePassword } from '../modules/user/ChangePassword.resolver';
import { ConfirmUserResolver } from '../modules/user/ConfirmUser.resolver';
import { ForgotPasswordResolver } from '../modules/user/ForgotPassword.resolver';
import { LoginResolver } from '../modules/user/Login.resolver';
import { LogoutResolver } from '../modules/user/Logout.resolver';
import { MeResolver } from '../modules/user/Me.resolver';
import { RegisterResolver } from '../modules/user/Register.resolver';
import { ProductResolver } from '../modules/product/resolver/crudResolver';
import { ProfilePictureResolver } from '../modules/user/ProfilePicture';

export const createSchema = () =>
  buildSchema({
    resolvers: [
      ChangePassword,
      ConfirmUserResolver,
      CreateUserResolver,
      ForgotPasswordResolver,
      LoginResolver,
      LogoutResolver,
      MeResolver,
      RegisterResolver,
      ProductResolver,
      ProfilePictureResolver,
    ],
    authChecker: ({ context: { req } }) => !!req.session.userId,
  });
