import bcrypt from 'bcrypt';

export default class AuthService {
  public static hashPassword(password: string, salt = 10): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public static isPasswordEqual(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
