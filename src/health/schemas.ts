import { Type } from "@sinclair/typebox";
import { RouteSchema } from "../utils";

export type Health = RouteSchema<typeof Health>;
export const Health = new RouteSchema({
    response: {
        "200": Type.Object({
            message: Type.String(),
        }),
        "503": Type.Object({
            message: Type.String(),
        }),
    },
});
