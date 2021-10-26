import type { Static } from "@sinclair/typebox";
import type { FastifySchema } from "fastify";

type SchemaKeyMap = {
    body: "Body";
    querystring: "Querystring";
    params: "Params";
    headers: "Headers";
    response: "Reply";
};

export const RouteSchema = function (options: FastifySchema) {
    return options;
} as unknown as {
    new <T extends FastifySchema>(options: T): T;
};

// prettier-ignore
export type RouteSchema<T> = {
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
