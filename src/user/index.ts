import type { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance, options: {}) {
    app.register(import("./user-controller"), {
        prefix: "/user",
    });
}
