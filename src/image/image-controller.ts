import type { FastifyInstance } from "fastify";
import path from "path";
import { v4 } from "uuid";
import type { ImageService } from "./image-service";
import { validateMultipartData } from "./multipart-validator";

type Options = {
    imageService: ImageService;
};

export default async function (app: FastifyInstance, options: Options) {
    const { imageService } = options;
    app.route({
        method: "POST",
        url: "/",
        preValidation: app.preValidationAuthGuard,
        handler: async (request, reply) => {
            const validationResult = await validateMultipartData(request);
            if (!validationResult.success) {
                reply.code(400);
                return { success: false, message: validationResult.message };
            }
            const { fields } = validationResult;
            const result = await imageService.uploadImageToS3({
                keyName: v4() + path.extname(fields.image.filename),
                file: fields.image.file,
                mimetype: fields.image.mimetype,
            });
            if (!result.success) {
                reply.code(500);
                return { success: false, message: result.error.message };
            }
            const { metadata } = await imageService.createImageMetadata({
                imageURL: result.url,
                caption: fields.caption.value,
                tags: fields.tags.map((field) => field.value),
                authorId: request.user?.id || "f2288faf-67b1-4c16-8cbc-e4aa5bfef9a2",
            });
            await app.orm.em.flush();
            reply.code(201);
            return {
                success: true,
                image: {
                    id: metadata.id,
                    imageURL: metadata.imageURL,
                    caption: metadata.caption,
                    tags: metadata.tags,
                },
            };
        },
    });
}
