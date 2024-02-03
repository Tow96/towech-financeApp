import jwt from 'jsonwebtoken';

export default class TokenGenerator {
  static authToken = (user: any) => {
    return jwt.sign(
      {
        name: user.name,
        username: user.username,
        _id: user._id,
        role: user.role,
        accountConfirmed: user.accountConfirmed,
      },
      process.env.AUTH_TOKEN_KEY as string,
      { expiresIn: '1m' }
    );
  };

  static refreshToken = (user: any, keepSession: boolean): string => {
    return jwt.sign({ _id: user.id }, process.env.REFRESH_TOKEN_KEY as string, {
      expiresIn: keepSession ? '30d' : '1h',
    });
  };

  // static passwordToken = (id: string): string => {
  //   return jwt.sign(
  //     {
  //       id: id,
  //       content: 'passwordReset',
  //     },
  //     process.env.PASSWORD_TOKEN_KEY as string,
  //     {
  //       expiresIn: '24h',
  //     },
  //   );
  // };

  static verificationToken = (id: string, email: string): string => {
    return jwt.sign(
      { user_id: id, email: email },
      process.env.EMAILVERIFICATION_TOKEN_KEY as string,
      { expiresIn: '7d' }
    );
  };
}
