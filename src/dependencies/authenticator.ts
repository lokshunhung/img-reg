import type { FastifyInstance } from "fastify";
import { Authenticator } from "fastify-passport";
import { Strategy as LocalStrategy } from "passport-local";

interface User {
    id: string;
    username: string;
    password: string;
}

const users: Record<string, User> = {
    bob: { id: "1", username: "bob", password: "1234" },
};

function createAuthenticator(): Authenticator {
    const authenticator = new Authenticator();
    const localStrategy = new LocalStrategy({}, async (username, password, done) => {
        const user = users[username];
        if (user === undefined) return done(null, false);
        if (user.password !== password) return done(null, false);
        return done(null, user);
    });
    authenticator.use("local", localStrategy);
    authenticator.registerUserSerializer(async (user: User, _) => user.username);
    authenticator.registerUserDeserializer(async (serialized: string, _) => users[serialized]);
    return authenticator;
}

declare module "fastify" {
    interface FastifyInstance {
        authenticator: Authenticator;
    }
}

export default async function (app: FastifyInstance, options: {}) {
    const authenticator = createAuthenticator();
    app.decorate("authenticator", authenticator);
    app.register(authenticator.initialize());
    app.register(authenticator.secureSession());
}
