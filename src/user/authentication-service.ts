import type { EntityRepository } from "@mikro-orm/postgresql";
import type { HashingService } from "../dependencies/hashing-service";
import type { User } from "../domain/user";
import type { PasswordValidator } from "./password-validator";

type CreateUserParams = {
    username: string;
    password: string;
};

type CreateUserResult =
    | {
          success: true;
          user: {
              id: string;
              username: string;
              createdAt: Date;
              updatedAt: Date;
          };
      }
    | {
          success: false;
          message: string;
      };

export class AuthenticationService {
    constructor(
        readonly userRepository: EntityRepository<User>,
        readonly passwordValidator: PasswordValidator,
        readonly hashingService: HashingService,
    ) {}

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
        const hashedPassword = await this.hashingService.hashPassword(params.password);
        const user = userRepository.create({
            username: params.username,
            password: hashedPassword.password,
            salt: hashedPassword.salt,
        });
        await userRepository.persistAndFlush(user);
        return {
            success: true,
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
    }
}
