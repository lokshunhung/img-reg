import { Static, Type } from "@sinclair/typebox";
import type { FastifySchema } from "fastify";

type SchemaKeyMap = {
    body: "Body";
    querystring: "Querystring";
    params: "Params";
    headers: "Headers";
    response: "Reply";
};

const RouteSchema = function (options: FastifySchema) {
    return options;
} as unknown as {
    new <T extends FastifySchema>(options: T): T;
};
// prettier-ignore
type RouteSchema<T> = {
    [K in keyof T as K extends keyof SchemaKeyMap ? SchemaKeyMap[K] : never]:
        K extends "response"
            ? Static<T[K][keyof T[K]]> extends infer R
                ? {
                      [P in keyof R]: R[P] extends infer R2
                          ? { [P2 in keyof R2]: R2[P2] }
                          : never
                  }
                : never
            : Static<T[K]> extends infer R ? { [P in keyof R]: R[P] } : never
};

export type Register = RouteSchema<typeof Register>;
export const Register = new RouteSchema({
    body: Type.Object(
        {
            username: Type.String(),
            password: Type.String(),
        },
        { additionalProperties: false },
    ),
    response: {
        "201": Type.Object(
            {
                success: Type.Boolean(),
                user: Type.Object(
                    {
                        id: Type.String(),
                        username: Type.String(),
                        createdAt: Type.Any(),
                        updatedAt: Type.Any(),
                    },
                    { additionalProperties: false },
                ),
            },
            { additionalProperties: false },
        ),
        "409": Type.Object(
            {
                success: Type.Boolean(),
                message: Type.String(),
            },
            { additionalProperties: false },
        ),
    },
});

export type ChangePassword = RouteSchema<typeof ChangePassword>;
export const ChangePassword = new RouteSchema({
    body: Type.Object(
        {
            password: Type.String(),
            newPassword: Type.String(),
        },
        {
            additionalProperties: false,
        },
    ),
    response: {
        "200": Type.Object(
            {
                success: Type.Boolean(),
            },
            { additionalProperties: false },
        ),
        "400": Type.Object(
            {
                success: Type.Boolean(),
                message: Type.String(),
            },
            { additionalProperties: false },
        ),
    },
});
