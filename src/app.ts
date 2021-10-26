import type { FastifyInstance } from "fastify";
import account from "./account";
import dependencies from "./dependencies";
import health from "./health";
import image from "./image";
import user from "./user";

export default async function app(app: FastifyInstance, options: {}) {
    app.register(dependencies);
    app.register(health);
    app.register(account);
    app.register(image);
    app.register(user);
}
