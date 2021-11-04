import { Resolver, Mutation, Arg } from 'type-graphql';
import { v4 } from 'uuid';
import { forgotPasswordPrefix } from '../constants/redisPrefixes';
import { User } from '../../entity/User';
import { sendEmail } from '../utils/sendmail';
import { redis } from '../../redis';

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });
    if (user) {
      const token = v4();
      await redis.set(
        forgotPasswordPrefix + token,
        user.id,
        'ex',
        60 * 60 * 24
      ); // 1 day expiratoin
      await sendEmail(
        email,
        `http://localhost:3000/user/change-password/${token}`
      );
    }

    return true;
  }
}
