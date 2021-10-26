import type { FastifyInstance } from "fastify";
import fastifySwagger from "fastify-swagger";

export default async function (app: FastifyInstance, options: {}) {
    app.register(fastifySwagger, {
        routePrefix: "/api/doc",
        swagger: {
            info: {
                title: "Swagger img-reg",
                description: "API documentation for img-reg",
                version: "0.0.1",
            },
            // TODO: HOST
            // @ts-ignore
            host: app.appConfig.HOST || "localhost",
        },
        exposeRoute: true,
    });
}
