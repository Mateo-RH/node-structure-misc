import { Query, Resolver, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import { MyContext } from '../../types/MyContext';

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true, complexity: 5 })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    return userId() ? User.findOne(userId()) : undefined;
    function userId() {
      return ctx.req.session!.userId || 1;
    }
  }
}
