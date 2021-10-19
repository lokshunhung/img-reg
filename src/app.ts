import type { FastifyInstance } from "fastify";
import dependencies from "./dependencies";
import health from "./health";
import image from "./image";

export default async function app(app: FastifyInstance, options: any) {
    app.register(dependencies);
    app.register(health);
    app.register(image);
}
