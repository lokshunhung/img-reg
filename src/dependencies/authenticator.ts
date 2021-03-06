import type { FastifyInstance, FastifyReply, FastifyRequest, preValidationAsyncHookHandler } from "fastify";
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
    authenticator.registerUserSerializer(async (user: User, _) => user.id);
    authenticator.registerUserDeserializer(async (serialized: string, _) => {
        const user = await userRepository.findOne({ id: serialized }, { disableIdentityMap: true });
        if (user === null) {
            return null;
        }
        const { password, salt, ...userOmitPassword } = user;
        return userOmitPassword;
    });
    return authenticator;
}

async function authGuard(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
        reply.code(401).send();
    }
}

declare module "fastify" {
    interface FastifyInstance {
        authenticator: Authenticator;
        preValidationAuthGuard: preValidationAsyncHookHandler;
    }

    interface PassportUser extends Omit<User, "password" | "salt"> {}
}

export default async function (app: FastifyInstance, options: {}) {
    const { orm, hashingService } = app;
    const userRepository = getUserRepository(orm);
    const authenticator = createAuthenticator(userRepository, hashingService);
    app.decorate("authenticator", authenticator);
    app.decorate("preValidationAuthGuard", authGuard);
    app.register(authenticator.initialize());
    app.register(authenticator.secureSession());
}
