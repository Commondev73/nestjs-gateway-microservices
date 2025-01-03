import { User } from 'src/user/schema/user.schema';

export interface UserWithoutPassword extends Partial<Omit<User, 'password'>> {}
