import type { FastifyInstance } from "fastify";

// https://stackoverflow.com/a/54228865
const PASSWORD_REGEXP = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

function createPasswordValidator() {
    return {
        validate: async (password: string): Promise<boolean> => {
            return PASSWORD_REGEXP.test(password);
        },
    };
}

export type PasswordValidator = ReturnType<typeof createPasswordValidator>;

declare module "fastify" {
    interface FastifyInstance {
        passwordValidator: PasswordValidator;
    }
}

export default async function (app: FastifyInstance, options: {}) {
    app.decorate("passwordValidator", createPasswordValidator());
}
