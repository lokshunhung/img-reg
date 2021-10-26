import { Type } from "@sinclair/typebox";
import { RouteSchema } from "../utils";

export type Upload = RouteSchema<typeof Upload>;
export const Upload = new RouteSchema({
    response: {
        "201": Type.Object(
            {
                success: Type.Boolean(),
                data: Type.Object(
                    {
                        id: Type.String(),
                        imageURL: Type.String(),
                        caption: Type.String(),
                        tags: Type.Array(Type.String()),
                    },
                    { additionalProperties: false },
                ),
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
        "503": Type.Object(
            {
                success: Type.Boolean(),
                message: Type.String(),
            },
            { additionalProperties: false },
        ),
    },
});
