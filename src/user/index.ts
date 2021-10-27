import type { FastifyInstance } from "fastify";
import { getUserRepository } from "../domain/repositories";
import { UserService } from "./user-service";

export default async function (app: FastifyInstance, options: {}) {
    const { orm } = app;
    const userRepository = getUserRepository(orm);
    const userService = new UserService(userRepository);
    app.register(import("./user-controller"), {
        prefix: "/user",
        userService,
    });
}
