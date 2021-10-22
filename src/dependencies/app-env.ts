import type { FastifyInstance } from "fastify";
import fastifyEnv from "fastify-env";
import type * as Schema from "json-schema";

const configSchema: Schema.JSONSchema7 = {
    type: "object",
    required: [
        "POSTGRES_HOST",
        "POSTGRES_DATABASE",
        "POSTGRES_USER",
        "POSTGRES_PASSWORD",
        "POSTGRES_PORT",
        "S3_BUCKET_NAME",
        "S3_ACCESS_KEY_ID",
        "S3_SECRET_ACCESS_KEY",
        "S3_ENDPOINT",
        "SECURE_SESSION_COOKIE_KEY",
    ],
    properties: {
        POSTGRES_HOST: { type: "string" },
        POSTGRES_DATABASE: { type: "string" },
        POSTGRES_USER: { type: "string" },
        POSTGRES_PASSWORD: { type: "string" },
        POSTGRES_PORT: { type: "number" },
        S3_BUCKET_NAME: { type: "string" },
        S3_ACCESS_KEY_ID: { type: "string" },
        S3_SECRET_ACCESS_KEY: { type: "string" },
        S3_ENDPOINT: { type: "string" },
        SECURE_SESSION_COOKIE_KEY: { type: "string" },
    },
};

declare module "fastify" {
    interface FastifyInstance {
        appConfig: {
            POSTGRES_HOST: string;
            POSTGRES_DATABASE: string;
            POSTGRES_USER: string;
            POSTGRES_PASSWORD: string;
            POSTGRES_PORT: number;
            S3_BUCKET_NAME: string;
            S3_ACCESS_KEY_ID: string;
            S3_SECRET_ACCESS_KEY: string;
            S3_ENDPOINT: string;
            SECURE_SESSION_COOKIE_KEY: string;
        };
    }
}

export default async function (app: FastifyInstance, options: {}) {
    app.register(fastifyEnv, {
        confKey: "appConfig",
        dotenv: {
            debug: process.env.NODE_ENV !== "production",
            path: process.cwd() + "/.env",
        },
        schema: configSchema,
    });
}
