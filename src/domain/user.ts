import type { Base } from "./base";

export interface User extends Base {
    username: string;
    password: string;
}
