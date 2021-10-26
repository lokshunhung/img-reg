import { v4 } from "uuid";

export class Base {
    id: string = v4();
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}
