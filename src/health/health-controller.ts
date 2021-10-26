import type { FastifyInstance } from "fastify";
import type { HealthService } from "./health-service";

type Options = {
    healthService: HealthService;
};

export default async function (app: FastifyInstance, options: Options) {
    const { healthService } = options;
    app.route({
        method: "GET",
        url: "/",
        handler: async (request, reply) => {
            const postgresResult = await healthService.checkPostgresHealth();
            if (!postgresResult.healthy) {
                app.log.error({
                    context: "health-check",
                    message: "unhealthy",
                    data: { service: "postgres", description: postgresResult.message },
                });
                reply.code(503);
                return { message: "unhealthy" };
            }

            const s3Result = await healthService.checkS3BucketHealth();
            if (!s3Result.healthy) {
                app.log.error({
                    context: "health-check",
                    message: "unhealthy",
                    data: { service: "s3", description: s3Result.message },
                });
                reply.code(503);
                return { message: "unhealthy" };
            }

            reply.code(200);
            return { message: "healthy" };
        },
    });
}
