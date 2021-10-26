import { Base } from "./base";

export class User extends Base {
    username!: string;
    password!: string;
    salt!: string;
}
