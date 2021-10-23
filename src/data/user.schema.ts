import { EntitySchema } from "@mikro-orm/core";
import type { Base } from "../domain/base";
import type { User } from "../domain/user";

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
    },
});
