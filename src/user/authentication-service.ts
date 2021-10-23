import type { EntityRepository } from "@mikro-orm/knex";
import type { FastifyInstance } from "fastify";
import { UserSchema } from "../data/user.schema";
import type { User } from "../domain/user";
import type { PasswordValidator } from "./password-validator";

type CreateUserParams = {
    username: string;
    password: string;
};

type CreateUserResult =
    | {
          success: true;
          user: Omit<User, "password">;
      }
    | {
          success: false;
          message: string;
      };

type Options = {
    userRepository: EntityRepository<User>;
    passwordValidator: PasswordValidator;
};

function createAuthenticationService(options: Options) {
    const { userRepository, passwordValidator } = options;
    return {
        createUser: async (params: CreateUserParams): Promise<CreateUserResult> => {
            if (!(await passwordValidator.validate(params.password))) {
                return { success: false, message: "incorrect password format" };
            }
            const count = await userRepository.count({
                username: params.username,
            });
            if (count !== 0) {
                return { success: false, message: "username already exists" };
            }
            const user = userRepository.create({
                username: params.username,
                password: params.password,
            });
            await userRepository.persistAndFlush(user);
            const { password, ...userOmitPassword } = user;
            return { success: true, user: userOmitPassword };
        },
    };
}

declare module "fastify" {
    interface FastifyInstance {
        authenticationService: ReturnType<typeof createAuthenticationService>;
    }
}

export default async function (app: FastifyInstance, options: {}) {
    const { passwordValidator } = app;
    const userRepository: EntityRepository<User> = app.orm.em.getRepository(UserSchema);
    app.decorate(
        "authenticationService",
        createAuthenticationService({
            userRepository,
            passwordValidator,
        }),
    );
}
