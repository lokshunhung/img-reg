import { EntitySchema } from "@mikro-orm/core";
import { v4 } from "uuid";
import type { Base } from "./base";

export const BaseSchema = new EntitySchema<Base>({
    abstract: true,
    name: "Base",
    properties: {
        id: {
            type: "uuid",
            primary: true,
            onCreate: () => v4(),
        },
        createdAt: {
            type: "Date",
            nullable: false,
            onCreate: () => new Date(),
        },
        updatedAt: {
            type: "Date",
            nullable: false,
            onCreate: () => new Date(),
            onUpdate: () => new Date(),
        },
    },
});
