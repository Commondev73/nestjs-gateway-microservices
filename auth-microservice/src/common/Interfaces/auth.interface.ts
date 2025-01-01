import { User } from 'src/users/schema/user.schema';

export interface AuthJwtToken {
  accessToken: string;
  refreshToken: string;
}
