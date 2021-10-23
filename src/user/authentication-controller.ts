import type { FastifyInstance } from "fastify";
import type { JSONSchema7 } from "json-schema";

const registerBodySchema: JSONSchema7 = {
    type: "object",
    required: ["username", "password"],
    properties: {
        username: { type: "string" },
        password: { type: "string" },
    },
};

interface RegisterBody {
    username: string;
    password: string;
}

export default async function (app: FastifyInstance, options: {}) {
    app.route({
        method: "POST",
        url: "/login",
        preValidation: app.authenticator.authenticate("local"),
        handler: async (request, reply) => {
            app.log.info(`user ${request.user} login successful`);
            reply.status(200).send();
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
            const result = await app.authenticationService.createUser({
                username: request.body.username,
                password: request.body.password,
            });
            if (!result.success) {
                reply.status(409).send({ message: result.message });
                return;
            }
            reply.status(201).send(result);
        },
    });
}
