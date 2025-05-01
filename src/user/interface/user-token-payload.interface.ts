import { UserTokenType } from '../enum/user-token-type.enum';

export interface UserTokenPayload {
  tokenType: UserTokenType;
  username: string;
  userId: string;
}
