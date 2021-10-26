import type { FastifyInstance } from "fastify";
import type { Authenticator } from "fastify-passport";
import type { JSONSchema7 } from "json-schema";
import type { AccountService } from "./account-service";

const registerBodySchema: JSONSchema7 = {
    type: "object",
    required: ["username", "password"],
    properties: {
        username: { type: "string" },
        password: { type: "string" },
    },
};

type RegisterBody = { username: string; password: string };

type Options = {
    authenticator: Authenticator;
    accountService: AccountService;
};

export default async function (app: FastifyInstance, options: Options) {
    const { accountService, authenticator } = options;
    app.route({
        method: "POST",
        url: "/login",
        preValidation: authenticator.authenticate("local"),
        handler: async (request, reply) => {
            app.log.info(`user ${request.user} login successful`);
            reply.code(200).send();
        },
    });
    app.route({
        method: "POST",
        url: "/logout",
        handler: async (request, reply) => {
            if (request.isAuthenticated()) {
                await request.logout();
            }
            reply.redirect("/");
        },
    });
    app.route<{
        Body: RegisterBody;
    }>({
        method: "POST",
        url: "/register",
        schema: {
            body: registerBodySchema,
        },
        handler: async (request, reply) => {
            const result = await accountService.createUser({
                username: request.body.username,
                password: request.body.password,
            });
            if (!result.success) {
                reply.code(409).send({ message: result.message });
                return;
            }
            reply.code(201).send(result.user);
        },
    });
    app.route({
        method: "GET",
        url: "/account",
        preValidation: app.preValidationAuthGuard,
        handler: async (request, reply) => {
            return request.user!;
        },
    });
}
