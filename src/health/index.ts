import type { FastifyInstance } from "fastify";
import { HealthService } from "./health-service";

export default async function (app: FastifyInstance, options: {}) {
    const { s3Client, appConfig, orm } = app;
    const bucketName = appConfig.S3_BUCKET_NAME;
    const knex = orm.em.getKnex();
    const healthService = new HealthService(s3Client, bucketName, knex);
    app.register(import("./health-controller"), {
        prefix: "/health",
        healthService,
    });
}
