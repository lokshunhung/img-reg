import type { FastifyInstance } from "fastify";
import imageController from "./image-controller";
import { ImageService } from "./image-service";

export default async function (app: FastifyInstance, options: {}) {
    const { s3Client, appConfig } = app;
    const bucketName = appConfig.S3_BUCKET_NAME;
    const imageService = new ImageService(s3Client, bucketName);
    app.register(imageController, {
        prefix: "/image",
        imageService,
    });
}
