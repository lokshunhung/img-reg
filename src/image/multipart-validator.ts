import Ajv from "ajv";
import type { MultipartFile } from "fastify-multipart";
import type { IncomingHttpHeaders } from "http";
import type { JSONSchema7 } from "json-schema";

type MultipartField = {
    fieldname: string;
    value: string;
    fieldnameTruncated: boolean;
    valueTruncated: boolean;
};

const validMimetypes = {
    "image/jpeg": 1,
    "image/png": 1,
};

const fieldsSchema: JSONSchema7 = {
    type: "object",
    required: ["image", "caption", "tags"],
    properties: {
        image: { $ref: "#/definitions/multipartFormFile" },
        caption: { $ref: "#/definitions/multipartFormField" },
        tags: { type: "array", items: { $ref: "#/definitions/multipartFormField" } },
    },
    definitions: {
        multipartFormFile: {
            type: "object",
            required: ["fieldname", "filename", "encoding", "mimetype"],
            properties: {
                fieldname: { type: "string" },
                filename: { type: "string" },
                encoding: { type: "string" },
                mimetype: { type: "string" },
            },
        },
        multipartFormField: {
            type: "object",
            required: ["fieldname", "value", "fieldnameTruncated", "valueTruncated"],
            properties: {
                fieldname: { type: "string" },
                value: { type: "string" },
                fieldnameTruncated: { type: "boolean" },
                valueTruncated: { type: "boolean" },
            },
        },
    },
};

type ValidatedFields = {
    image: MultipartFile;
    caption: MultipartField;
    tags: Array<MultipartField>;
};

const ajv = new Ajv();

const validateMultipartFields = ajv.compile(fieldsSchema);

type Params = {
    headers: IncomingHttpHeaders;
    isMultipart: () => boolean;
    file: () => Promise<MultipartFile>;
};

type Result =
    | {
          success: true;
          fields: ValidatedFields;
      }
    | {
          success: false;
          message: string;
          context: any;
      };

export async function validateMultipartData(request: Params): Promise<Result> {
    // request.isMultipart only works after Parsing lifecycle (https://www.fastify.io/docs/latest/Lifecycle/)
    // ref: https://github.com/fastify/fastify-multipart/blob/40d0d64c3928720d939afe0c5ac64a030c81c892/index.js#L173
    if (!request.isMultipart()) {
        const context = { contentType: request.headers["content-type"] };
        return { success: false, message: "expect multipart form request", context };
    }
    const data = await request.file();
    if (!(data.mimetype in validMimetypes)) {
        const context = { mimeType: data.mimetype };
        return { success: false, message: "expect jpeg, png mimetype", context };
    }
    const isValid = validateMultipartFields(data.fields);
    if (!isValid) {
        const context = { validationErrors: validateMultipartFields.errors };
        return { success: false, message: "unexpected multipart fields", context };
    }
    return { success: true, fields: data.fields as any };
}
