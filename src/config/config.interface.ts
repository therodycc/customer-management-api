export interface JWTConstantsI {
  secret: string;
  expireTime: string;
}

export interface CookieConstantsI {
  name: string;
  secure: boolean;
  sameSite: string;
  maxAge: number;
}
