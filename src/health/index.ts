import type * as AWS from "aws-sdk";
import type { FastifyInstance } from "fastify";

type HealthCheckResult = { healthy: true; message?: string } | { healthy: false; message: string };

async function checkS3BucketHealth(s3Client: AWS.S3, bucketName: string): Promise<HealthCheckResult> {
    return await new Promise((resolve, reject) => {
        s3Client.headBucket({ Bucket: bucketName }, (error, data) => {
            if (error) {
                resolve({ healthy: false, message: error.message });
            } else {
                resolve({ healthy: true });
            }
        });
    });
}

export default async function (app: FastifyInstance, options: {}) {
    app.route({
        method: "GET",
        url: "/health",
        handler: async (request, reply) => {
            const s3Result = await checkS3BucketHealth(app.s3Client, app.appConfig.S3_BUCKET_NAME);
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
