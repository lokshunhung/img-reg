import type { MikroORM } from "@mikro-orm/core";
import type { EntityRepository } from "@mikro-orm/postgresql";
import type { Image } from "./image";
import { ImageSchema } from "./image.schema";
import type { User } from "./user";
import { UserSchema } from "./user.schema";

export type UserRepository = EntityRepository<User>;

export type ImageRepository = EntityRepository<Image>;

export function getUserRepository(orm: MikroORM): UserRepository {
    return orm.em.getRepository(UserSchema);
}

export function getImageRepository(orm: MikroORM): ImageRepository {
    return orm.em.getRepository(ImageSchema);
}
