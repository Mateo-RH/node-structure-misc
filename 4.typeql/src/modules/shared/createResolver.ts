import { Arg, ClassType, Mutation, Query, Resolver } from 'type-graphql';

export function createResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any
) {
  @Resolver()
  class BaseResolver {
    @Query(() => returnType, { name: `get${suffix}` })
    async get(@Arg('id') id: number) {
      return entity.findOne(id);
    }

    @Query(() => [returnType], { name: `list${suffix}` })
    async list() {
      return entity.find();
    }

    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg('input', () => inputType) data: any) {
      return entity.create(data).save();
    }
  }
  return BaseResolver;
}
