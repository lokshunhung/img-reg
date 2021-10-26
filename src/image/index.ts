import type { FastifyInstance } from "fastify";
import { ImageService } from "./image-service";

export default async function (app: FastifyInstance, options: {}) {
    const { s3Client, appConfig } = app;
    const bucketName = appConfig.S3_BUCKET_NAME;
    const imageService = new ImageService(s3Client, bucketName);
    app.register(import("./image-controller"), {
        prefix: "/image",
        imageService,
    });
}
