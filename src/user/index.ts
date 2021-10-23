import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import authenticationController from "./authentication-controller";
import authenticationService from "./authentication-service";
import passwordValidator from "./password-validator";

export default async function (app: FastifyInstance, options: {}) {
    app.register(fp(passwordValidator));
    app.register(fp(authenticationService));
    app.register(authenticationController, {
        prefix: "/", // no prefix
    });
}
