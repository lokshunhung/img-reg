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
    constructor(readonly s3Client: AWS.S3, readonly bucketName: string) {}

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
