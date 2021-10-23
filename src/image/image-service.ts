import type * as AWS from "aws-sdk";
import type { Readable } from "stream";

type Options = {
    s3: AWS.S3;
    bucketName: string;
};

type UploadToS3Params = {
    file: Readable;
    keyName: string;
    mimetype: string;
};

type UploadToS3Result = {
    url: string;
};

export class ImageService {
    constructor(readonly s3Client: AWS.S3, readonly bucketName: string) {}
    async uploadImageToS3(params: UploadToS3Params): Promise<UploadToS3Result> {
        const { s3Client, bucketName } = this;
        return await new Promise<UploadToS3Result>((resolve, reject) => {
            const request: AWS.S3.Types.PutObjectRequest = {
                Bucket: bucketName,
                Key: params.keyName,
                Body: params.file,
                ContentLength: params.file.readableLength,
                ContentType: params.mimetype,
            };
            s3Client.upload(request, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: data.Location,
                    });
                }
            });
        });
    }
}
