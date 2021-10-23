import type { EntityRepository } from "@mikro-orm/core";
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

export class AuthenticationService {
    constructor(readonly userRepository: EntityRepository<User>, readonly passwordValidator: PasswordValidator) {}

    async createUser(params: CreateUserParams): Promise<CreateUserResult> {
        const { userRepository, passwordValidator } = this;
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
    }
}
