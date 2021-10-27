import { Type } from "@sinclair/typebox";
import { RouteSchema } from "../utils";

export type GetUserByUsername = RouteSchema<typeof GetUserByUsername>;
export const GetUserByUsername = new RouteSchema({
    params: Type.Object(
        {
            username: Type.String(),
        },
        { additionalProperties: false },
    ),
});
