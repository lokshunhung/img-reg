import type { MikroORM } from "@mikro-orm/core";
import type { EntityRepository } from "@mikro-orm/postgresql";
import type { User } from "./user";
import { UserSchema } from "./user.schema";

export type UserRepository = EntityRepository<User>;

export function getUserRepository(orm: MikroORM): UserRepository {
    return orm.em.getRepository(UserSchema);
}
