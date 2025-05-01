import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class LoginDto extends PickType(CreateUserDto, [
  'username',
  'password',
] as const) {
  // You can add additional properties or methods if needed
}