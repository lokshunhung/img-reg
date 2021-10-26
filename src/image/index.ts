import type { FastifyInstance } from "fastify";
import { getImageRepository } from "../domain/repositories";
import { ImageService } from "./image-service";

export default async function (app: FastifyInstance, options: {}) {
    const { s3Client, appConfig, orm } = app;
    const bucketName = appConfig.S3_BUCKET_NAME;
    const imageRepository = getImageRepository(orm);
    const imageService = new ImageService(s3Client, bucketName, imageRepository);
    app.register(import("./image-controller"), {
        prefix: "/image",
        imageService,
    });
}
