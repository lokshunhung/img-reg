import type { Knex } from "@mikro-orm/postgresql";

type HealthCheckResult =
    | {
          healthy: true;
          message?: string;
      }
    | {
          healthy: false;
          message: string;
      };

export class HealthService {
    constructor(readonly s3Client: AWS.S3, readonly bucketName: string, readonly knex: Knex) {}

    async checkPostgresHealth(): Promise<HealthCheckResult> {
        const { knex } = this;
        try {
            const { rows } = await knex.raw(
                `SELECT CAST(? AS TEXT) AS status
                `,
                ["ACK"],
            );
            if (rows[0].status !== "ACK") {
                return { healthy: false, message: "NCK" };
            }
            return { healthy: true };
        } catch (error) {
            return { healthy: false, message: (error as Error).message };
        }
    }

    async checkS3BucketHealth(): Promise<HealthCheckResult> {
        const { s3Client, bucketName } = this;
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
}
