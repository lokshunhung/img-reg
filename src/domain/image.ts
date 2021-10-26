import { Base } from "./base";
import type { User } from "./user";

export class Image extends Base {
    imageURL!: string;
    caption!: string;
    author!: User;
    tags!: Array<string>;
}
