import type { FastifyInstance } from "fastify";
import fastifyMultipart from "fastify-multipart";

export default async function (app: FastifyInstance, options: any) {
    app.register(fastifyMultipart);
}
