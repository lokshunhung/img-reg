import { EntitySchema } from "@mikro-orm/core";
import type { Base } from "./base";
import type { User } from "./user";

export const UserSchema = new EntitySchema<User, Base>({
    name: "User",
    extends: "Base",
    properties: {
        username: {
            type: "text",
            nullable: false,
        },
        password: {
            type: "text",
            nullable: false,
        },
        salt: {
            type: "text",
            nullable: false,
        },
    },
});
