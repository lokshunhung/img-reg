import type { EntityRepository } from "@mikro-orm/postgresql";
import type { FastifyInstance } from "fastify";
import { Authenticator } from "fastify-passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { User } from "../domain/user";
import { UserSchema } from "../domain/user.schema";
import type { HashingService } from "./hashing-service";

function createAuthenticator(userRepository: EntityRepository<User>, hashingService: HashingService): Authenticator {
    const authenticator = new Authenticator();
    const localStrategy = new LocalStrategy({}, async (username, password, done) => {
        const user = await userRepository.findOne({ username });
        if (user === null) {
            return done(null, false);
        }
        const isCorrectPassword = await hashingService.checkUserPassword(user, password);
        if (!isCorrectPassword) {
            return done(null, false);
        }
        return done(null, user);
    });
    authenticator.use("local", localStrategy);
    authenticator.registerUserSerializer(async (user: User, _) => user.username);
    authenticator.registerUserDeserializer(async (serialized: string, _) => {
        return userRepository.findOne({ username: serialized });
    });
    return authenticator;
}

declare module "fastify" {
    interface FastifyInstance {
        authenticator: Authenticator;
    }
}

export default async function (app: FastifyInstance, options: {}) {
    const { orm, hashingService } = app;
    const userRepository = orm.em.getRepository(UserSchema);
    const authenticator = createAuthenticator(userRepository, hashingService);
    app.decorate("authenticator", authenticator);
    app.register(authenticator.initialize());
    app.register(authenticator.secureSession());
}
