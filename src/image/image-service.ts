import type * as AWS from "aws-sdk";
import type { FastifyInstance } from "fastify";
import type { Readable } from "stream";

interface Options {
    s3: AWS.S3;
    bucketName: string;
}

interface UploadToS3Params {
    file: Readable;
    keyName: string;
    mimetype: string;
}

interface UploadToS3Result {
    url: string;
}

function imageService(options: Options) {
    return {
        uploadImageToS3: async (params: UploadToS3Params): Promise<UploadToS3Result> => {
            return await new Promise<UploadToS3Result>((resolve, reject) => {
                const request: AWS.S3.Types.PutObjectRequest = {
                    Bucket: options.bucketName,
                    Key: params.keyName,
                    Body: params.file,
                    ContentLength: params.file.readableLength,
                    ContentType: params.mimetype,
                };
                options.s3.upload(request, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            url: data.Location,
                        });
                    }
                });
            });
        },
    };
}

declare module "fastify" {
    interface FastifyInstance {
        imageService: ReturnType<typeof imageService>;
    }
}

export default async function (app: FastifyInstance, options: Options) {
    app.decorate("imageService", imageService(options));
}
