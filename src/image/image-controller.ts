import type { FastifyInstance } from "fastify";
import path from "path";
import { v4 } from "uuid";
import type { ImageService } from "./image-service";
import { validateMultipartData } from "./multipart-validator";
import * as Schemas from "./schemas";

type Options = {
    imageService: ImageService;
};

export default async function (app: FastifyInstance, options: Options) {
    const { imageService } = options;
    app.route<Schemas.Upload>({
        method: "POST",
        url: "/",
        schema: Schemas.Upload,
        preValidation: app.preValidationAuthGuard,
        handler: async (request, reply) => {
            request.headers["content-type"];
            const validationResult = await validateMultipartData(request);
            if (!validationResult.success) {
                app.log.warn({
                    context: "image/upload",
                    message: "input validation failure",
                    data: validationResult.context,
                });
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
                app.log.error({
                    context: "image/upload",
                    message: "upload s3 failure",
                    data: result.error,
                });
                reply.code(503);
                return { success: false, message: "service unavailable" };
            }
            const { metadata } = await imageService.createImageMetadata({
                imageURL: result.url,
                caption: fields.caption.value,
                tags: fields.tags.map((field) => field.value),
                authorId: request.user!.id,
            });
            await app.orm.em.flush();
            reply.code(201);
            return {
                success: true,
                data: {
                    id: metadata.id,
                    imageURL: metadata.imageURL,
                    caption: metadata.caption,
                    tags: metadata.tags,
                },
            };
        },
    });
}
