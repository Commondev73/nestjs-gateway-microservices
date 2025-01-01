import { User } from 'src/users/schema/user.schema';

export interface UserWithoutPassword extends Partial<Omit<User, 'password'>> {}
