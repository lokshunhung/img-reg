// https://stackoverflow.com/a/54228865
const PASSWORD_REGEXP = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

export class PasswordValidator {
    async validate(password: string): Promise<boolean> {
        return PASSWORD_REGEXP.test(password);
    }
}
