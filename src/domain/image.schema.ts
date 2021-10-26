import { EntitySchema } from "@mikro-orm/core";
import type { Base } from "./base";
import type { Image } from "./image";

export const ImageSchema = new EntitySchema<Image, Base>({
    name: "Image",
    extends: "Base",
    properties: {
        imageURL: {
            type: "text",
            nullable: false,
        },
        caption: {
            type: "text",
            nullable: true,
        },
        author: {
            reference: "m:1",
            entity: "User",
            inversedBy: "images",
        },
        tags: {
            type: "string[]",
            nullable: true,
        },
    },
});
