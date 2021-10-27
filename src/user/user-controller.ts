import type { FastifyInstance } from "fastify";
import * as Schemas from "./schemas";
import type { UserService } from "./user-service";

type Options = {
    userService: UserService;
};

export default async function (app: FastifyInstance, options: Options) {
    const { userService } = options;
    app.route<Schemas.GetUserByUsername>({
        method: "GET",
        url: "/:username",
        schema: Schemas.GetUserByUsername,
        handler: async (request, reply) => {
            const result = await userService.getUserByUsername({ username: request.params.username });
            if (!result.success) {
                reply.code(404);
                return { success: false };
            }
            return { success: true, data: result.user };
        },
    });
}
