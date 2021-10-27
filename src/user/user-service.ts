import type { UserRepository } from "../domain/repositories";
import type { User } from "../domain/user";

type GetUserByUsernameParams = {
    username: string;
};

type GetUserByUsernameResult =
    | {
          success: false;
      }
    | {
          success: true;
          user: Omit<User, "password" | "salt">;
      };

export class UserService {
    constructor(readonly userRepository: UserRepository) {}

    async getUserByUsername(params: GetUserByUsernameParams): Promise<GetUserByUsernameResult> {
        const { userRepository } = this;
        const user = await userRepository.findOne({ username: params.username });
        if (user === null) {
            return { success: false };
        }
        const { password, salt, ...userOmitPassword } = user;
        return { success: true, user: userOmitPassword };
    }
}
