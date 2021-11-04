import { Resolver, Mutation, Arg } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../redis';
import { confirmationUrlPrefix } from '../constants/redisPrefixes';

@Resolver()
export class ConfirmUserResolver {
    @Mutation(() => Boolean)
    async confirmUser(@Arg('token') token: string): Promise<Boolean> {
        const userId = await redis.get(confirmationUrlPrefix + token)
        if (!userId) return false

        await User.update({ id: parseInt(userId) }, { confirmed: true })
        await redis.del(confirmationUrlPrefix + token)
        return true
    }
}

