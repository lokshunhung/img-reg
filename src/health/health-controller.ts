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
            const s3Result = await healthService.checkS3BucketHealth();
            if (!s3Result.healthy) {
                reply.status(503).send({
                    message: "unhealthy",
                    data: { service: "s3", description: s3Result.message },
                });
                return;
            }

            reply.status(200).send({ message: "healthy" });
        },
    });
}
