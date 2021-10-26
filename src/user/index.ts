import type { EntityRepository } from "@mikro-orm/postgresql";
import type { FastifyInstance } from "fastify";
import { UserSchema } from "../data/user.schema";
import type { User } from "../domain/user";
import { AuthenticationService } from "./authentication-service";
import { PasswordValidator } from "./password-validator";

export default async function (app: FastifyInstance, options: {}) {
    const { orm, authenticator } = app;
    const userRepository: EntityRepository<User> = orm.em.getRepository(UserSchema);
    const passwordValidator = new PasswordValidator();
    const authenticationService = new AuthenticationService(userRepository, passwordValidator);
    app.register(import("./authentication-controller"), {
        prefix: "/", // no prefix
        authenticationService,
        authenticator,
    });
}
