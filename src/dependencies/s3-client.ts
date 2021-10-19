import * as AWS from "aws-sdk";
import type { FastifyInstance } from "fastify";

declare module "fastify" {
    interface FastifyInstance {
        s3Client: AWS.S3;
    }
}

export default async function (app: FastifyInstance, options: any) {
    const s3Client = new AWS.S3({
        accessKeyId: app.appConfig.S3_ACCESS_KEY_ID,
        secretAccessKey: app.appConfig.S3_SECRET_ACCESS_KEY,
        endpoint: app.appConfig.S3_ENDPOINT,
        s3ForcePathStyle: true,
    });
    app.decorate("s3Client", s3Client);
}
