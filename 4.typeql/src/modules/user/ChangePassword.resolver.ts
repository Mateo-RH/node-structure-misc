import { Resolver, Mutation, Arg } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { redis } from '../../redis';
import { ChangePasswordInput } from './changePassword/ChangePassword';
import { forgotPasswordPrefix } from '../constants/redisPrefixes';

@Resolver()
export class ChangePassword {
    @Mutation(() => User, { nullable: true })
    async changePassword(@Arg('input') { token, password }: ChangePasswordInput,
    ): Promise<User | null> {

        const userId = await redis.get(forgotPasswordPrefix + token)
        if (!userId) return null

        const user = await User.findOne(userId)
        if (!user) return null

        user.password = await bcrypt.hash(password, 10)
        await user.save()
        await redis.del(forgotPasswordPrefix + token)

        return user
    }
}

