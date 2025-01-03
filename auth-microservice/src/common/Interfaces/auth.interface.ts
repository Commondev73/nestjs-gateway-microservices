export interface AuthJwtToken {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  username: string;
}
