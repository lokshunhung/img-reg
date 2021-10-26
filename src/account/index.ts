import type { FastifyInstance } from "fastify";
import { getUserRepository } from "../domain/repositories";
import { AccountService } from "./account-service";
import { PasswordValidator } from "./password-validator";

export default async function (app: FastifyInstance, options: {}) {
    const { orm, authenticator, hashingService } = app;
    const userRepository = getUserRepository(orm);
    const passwordValidator = new PasswordValidator();
    const authenticationService = new AccountService(userRepository, passwordValidator, hashingService);
    app.register(import("./account-controller"), {
        prefix: "/", // no prefix
        accountService: authenticationService,
        authenticator,
    });
}
