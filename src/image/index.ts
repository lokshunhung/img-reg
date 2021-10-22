import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import imageController from "./image-controller";
import imageService from "./image-service";

export default async function (app: FastifyInstance, options: {}) {
    app.register(fp(imageService));
    app.register(imageController, {
        prefix: "/image",
    });
}
