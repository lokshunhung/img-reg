import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import imageController from "./image-controller";
import imageService from "./image-service";

export default async function (app: FastifyInstance, options: any) {
    app.register(fp(imageService), {
        s3: app.s3Client,
        bucketName: app.appConfig.S3_BUCKET_NAME,
    });
    app.register(imageController, {
        prefix: "/image",
    });
}
