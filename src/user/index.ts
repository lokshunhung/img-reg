import type { EntityRepository } from "@mikro-orm/postgresql";
import type { FastifyInstance } from "fastify";
import type { User } from "../domain/user";
import { UserSchema } from "../domain/user.schema";
import { AuthenticationService } from "./authentication-service";
import { PasswordValidator } from "./password-validator";

export default async function (app: FastifyInstance, options: {}) {
    const { orm, authenticator, hashingService } = app;
    const userRepository: EntityRepository<User> = orm.em.getRepository(UserSchema);
    const passwordValidator = new PasswordValidator();
    const authenticationService = new AuthenticationService(userRepository, passwordValidator, hashingService);
    app.register(import("./authentication-controller"), {
        prefix: "/", // no prefix
        authenticationService,
        authenticator,
    });
}
