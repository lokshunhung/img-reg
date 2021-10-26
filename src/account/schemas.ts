import { Type } from "@sinclair/typebox";
import { RouteSchema } from "../utils";

export type Login = RouteSchema<typeof Login>;
export const Login = new RouteSchema({
    body: Type.Object(
        {
            username: Type.String(),
            password: Type.String(),
        },
        { additionalProperties: false },
    ),
});

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
