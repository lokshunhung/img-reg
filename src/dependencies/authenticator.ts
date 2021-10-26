import type { FastifyInstance } from "fastify";
import { Authenticator } from "fastify-passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserRepository, UserRepository } from "../domain/repositories";
import type { User } from "../domain/user";
import type { HashingService } from "./hashing-service";

function createAuthenticator(userRepository: UserRepository, hashingService: HashingService): Authenticator {
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

    interface PassportUser extends User {}
}

export default async function (app: FastifyInstance, options: {}) {
    const { orm, hashingService } = app;
    const userRepository = getUserRepository(orm);
    const authenticator = createAuthenticator(userRepository, hashingService);
    app.decorate("authenticator", authenticator);
    app.register(authenticator.initialize());
    app.register(authenticator.secureSession());
}
