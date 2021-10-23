import type * as AWS from "aws-sdk";
import type { Readable } from "stream";

type UploadToS3Params = {
    file: Readable;
    keyName: string;
    mimetype: string;
};

type UploadToS3Result =
    | {
          success: true;
          url: string;
      }
    | {
          success: false;
          error: Error;
      };

export class ImageService {
    constructor(readonly s3Client: AWS.S3, readonly bucketName: string) {}

    async uploadImageToS3(params: UploadToS3Params): Promise<UploadToS3Result> {
        const { s3Client, bucketName } = this;
        return await new Promise<UploadToS3Result>((resolve) => {
            const request: AWS.S3.Types.PutObjectRequest = {
                Bucket: bucketName,
                Key: params.keyName,
                Body: params.file,
                ContentLength: params.file.readableLength,
                ContentType: params.mimetype,
            };
            s3Client.upload(request, (error, data) => {
                if (error) {
                    resolve({ success: false, error });
                } else {
                    resolve({ success: true, url: data.Location });
                }
            });
        });
    }
}
