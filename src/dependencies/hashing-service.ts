import { genSalt, hash } from "bcrypt";
import type { FastifyInstance } from "fastify";
import type { User } from "../domain/user";

export class HashingService {
    async createHashedPassword(plainTextPassword: string): Promise<{ password: string; salt: string }> {
        const salt = await genSalt();
        const password = await hash(plainTextPassword, salt);
        return { password, salt };
    }

    async checkUserPassword(user: User, plainTextPassword: string): Promise<boolean> {
        const password = await hash(plainTextPassword, user.salt);
        return password === user.password;
    }
}

declare module "fastify" {
    interface FastifyInstance {
        hashingService: HashingService;
    }
}

export default async function (app: FastifyInstance, options: {}) {
    const hashingService = new HashingService();
    app.decorate("hashingService", hashingService);
}
