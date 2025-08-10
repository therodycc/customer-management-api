export interface SessionSSO {
  userId: number;
  accessToken: string;
  completeName: string;
  userName: string;
  position?: string;
  expireAt: Date;
  success?: boolean;
  message?: string;
  total?: number;
  statusCode?: number;
}

export interface TokenData {
  given_name: string; //nombre completo
  unique_name: string; //username
  nameid: string;
  ApplicationId: string;
  sub: string; // aqui llega el email
  jti: string;
  exp: number;
  iss: string; //"http://localhost:4200/",
  aud: string; //"http://localhost:4200/"
}
