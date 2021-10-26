import { Collection } from "@mikro-orm/core";
import { Base } from "./base";
import type { Image } from "./image";

export class User extends Base {
    username!: string;
    password!: string;
    salt!: string;

    images = new Collection<Image>(this);
}
