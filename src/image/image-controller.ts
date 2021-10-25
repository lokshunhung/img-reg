import type { FastifyInstance } from "fastify";
import path from "path";
import { v4 } from "uuid";
import type { ImageService } from "./image-service";

const validMimetypes = {
    "image/jpeg": 1,
    "image/png": 1,
};

type Options = {
    imageService: ImageService;
};

export default async function (app: FastifyInstance, options: Options) {
    const { imageService } = options;
    app.route({
        method: "POST",
        url: "/",
        onRequest: async (request, reply) => {
            if (!request.headers["content-type"]?.startsWith("multipart/")) {
                reply.code(400).send({ success: false, message: "expect multipart request" });
            }
        },
        handler: async (request, reply) => {
            const data = await request.file();
            console.log("file" in data);
            if (!(data.mimetype in validMimetypes)) {
                reply.code(400).send({ success: false, message: "expect jpeg, png mimetype" });
            }
            const result = await imageService.uploadImageToS3({
                keyName: v4() + path.extname(data.filename),
                file: data.file,
                mimetype: data.mimetype,
            });
            if (!result.success) {
                reply.code(500);
                return { success: false, message: result.error.message };
            }
            reply.code(201);
            return { success: true, imageURL: result.url };
        },
    });
}
