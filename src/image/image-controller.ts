import type { FastifyInstance } from "fastify";
import path from "path";
import { v4 } from "uuid";

const validMimetypes = {
    "image/jpeg": 1,
    "image/png": 1,
};

export default async function (app: FastifyInstance, options: {}) {
    app.route({
        method: "POST",
        url: "/",
        onRequest: async (request, reply) => {
            if (!request.headers["content-type"]?.startsWith("multipart/")) {
                reply.code(400).send({ message: "expect multipart request" });
            }
        },
        handler: async (request, reply) => {
            const data = await request.file();
            console.log("file" in data);
            if (!(data.mimetype in validMimetypes)) {
                reply.code(400).send({ message: "expect jpeg, png mimetype" });
            }
            try {
                const result = await app.imageService.uploadImageToS3({
                    keyName: v4() + path.extname(data.filename),
                    file: data.file,
                    mimetype: data.mimetype,
                });
                reply.status(201);
                return {
                    success: true,
                    imageURL: result.url,
                };
            } catch (error: unknown) {
                reply.status(500);
                return {
                    success: false,
                    message: (error as Error).message,
                };
            }
        },
    });
}
