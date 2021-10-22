import type { FastifyInstance } from "fastify";
import authenticationController from "./authentication-controller";

export default async function (app: FastifyInstance, options: {}) {
    app.register(authenticationController, {
        prefix: "/", // no prefix
    });
}
