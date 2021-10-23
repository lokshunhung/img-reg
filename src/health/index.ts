import type { FastifyInstance } from "fastify";
import healthController from "./health-controller";
import { HealthService } from "./health-service";

export default async function (app: FastifyInstance, options: {}) {
    const { s3Client, appConfig } = app;
    const bucketName = appConfig.S3_BUCKET_NAME;
    const healthService = new HealthService(s3Client, bucketName);
    app.register(healthController, {
        prefix: "/health",
        healthService,
    });
}
