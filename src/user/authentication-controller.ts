import type { FastifyInstance } from "fastify";

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
}
