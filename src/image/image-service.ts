import type * as AWS from "aws-sdk";
import type { Readable } from "stream";
import type { Image } from "../domain/image";
import type { ImageRepository } from "../domain/repositories";

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

type CreateImageMetadataParams = {
    imageURL: string;
    caption: string;
    authorId: string;
    tags: Array<string>;
};

type CreateImageMetadataResult = {
    metadata: Omit<Image, "author">;
};

export class ImageService {
    constructor(readonly s3Client: AWS.S3, readonly bucketName: string, readonly imageRepository: ImageRepository) {}

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

    async createImageMetadata(params: CreateImageMetadataParams): Promise<CreateImageMetadataResult> {
        const { imageRepository } = this;
        const metadata = imageRepository.create({
            imageURL: params.imageURL,
            caption: params.caption,
            author: params.authorId,
            tags: params.tags,
        });
        imageRepository.persist(metadata);
        return { metadata };
    }
}
