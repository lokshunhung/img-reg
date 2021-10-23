import type { FastifyInstance } from "fastify";

// https://stackoverflow.com/a/54228865
const PASSWORD_REGEXP = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

export class PasswordValidator {
    async validate(password: string): Promise<boolean> {
        return PASSWORD_REGEXP.test(password);
    }
}

declare module "fastify" {
    interface FastifyInstance {
        passwordValidator: PasswordValidator;
    }
}

export default async function (app: FastifyInstance, options: {}) {
    app.decorate("passwordValidator", new PasswordValidator());
}
