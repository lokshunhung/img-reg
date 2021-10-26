import type { FastifyInstance } from "fastify";
import type { Authenticator } from "fastify-passport";
import type { AccountService } from "./account-service";
import * as Schemas from "./schemas";

type Options = {
    authenticator: Authenticator;
    accountService: AccountService;
};

export default async function (app: FastifyInstance, options: Options) {
    const { accountService, authenticator } = options;
    app.route<Schemas.Login>({
        method: "POST",
        url: "/login",
        schema: Schemas.Login,
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
    app.route<Schemas.Register>({
        method: "POST",
        url: "/register",
        schema: Schemas.Register,
        handler: async (request, reply) => {
            const result = await accountService.createUser({
                username: request.body.username,
                password: request.body.password,
            });
            if (!result.success) {
                reply.code(409);
                return { success: false, message: result.message };
            }
            await app.orm.em.flush();
            reply.code(201);
            return { success: true, user: result.user };
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
    app.route<Schemas.ChangePassword>({
        method: "POST",
        url: "/account/password",
        schema: Schemas.ChangePassword,
        preValidation: app.preValidationAuthGuard,
        handler: async (request, reply) => {
            const result = await accountService.changePassword({
                userId: request.user!.id,
                password: request.body.password,
                newPassword: request.body.newPassword,
            });
            if (!result.success) {
                reply.code(400);
                return { success: false, message: result.message };
            }
            await app.orm.em.flush();
            return { success: true };
        },
    });
}
