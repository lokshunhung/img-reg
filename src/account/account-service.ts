import type { HashingService } from "../dependencies/hashing-service";
import type { UserRepository } from "../domain/repositories";
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

type ChangePasswordParams = {
    userId: string;
    password: string;
    newPassword: string;
};

type ChangePasswordResult =
    | {
          success: true;
      }
    | {
          success: false;
          message: string;
      };

export class AccountService {
    constructor(
        readonly userRepository: UserRepository,
        readonly passwordValidator: PasswordValidator,
        readonly hashingService: HashingService,
    ) {}

    async createUser(params: CreateUserParams): Promise<CreateUserResult> {
        const { userRepository, passwordValidator, hashingService } = this;
        if (!(await passwordValidator.validate(params.password))) {
            return { success: false, message: "invalid password format" };
        }
        const count = await userRepository.count({
            username: params.username,
        });
        if (count !== 0) {
            return { success: false, message: "username already exists" };
        }
        const hashedPassword = await hashingService.createHashedPassword(params.password);
        const user = userRepository.create({
            username: params.username,
            password: hashedPassword.password,
            salt: hashedPassword.salt,
        });
        userRepository.persist(user);
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

    async changePassword(params: ChangePasswordParams): Promise<ChangePasswordResult> {
        const { userRepository, passwordValidator, hashingService } = this;
        const user = await userRepository.findOneOrFail({ id: params.userId });
        const isOldPasswordCorrect = await hashingService.checkUserPassword(user, params.password);
        if (!isOldPasswordCorrect) {
            return { success: false, message: "incorrect old password" };
        }
        if (!(await passwordValidator.validate(params.newPassword))) {
            return { success: false, message: "invalid password format" };
        }
        const newHashedPassword = await hashingService.createHashedPassword(params.newPassword);
        user.password = newHashedPassword.password;
        user.salt = newHashedPassword.salt;
        return { success: true };
    }
}
