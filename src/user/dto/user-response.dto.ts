import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsDate, IsString } from "class-validator";
import { UserDocument } from "../schema/user.schema";

export class UserResponseDto extends OmitType(
  CreateUserDto,
  ['password'],
) {
    @ApiProperty({
    description: 'Unique identifier for the user.',
    example: '66317de2e2b157cdce6f891a',
    })
    @IsString()
  id: string;

  @ApiProperty({
    description: 'The date when the user was created.',
    example: '2025-01-01T12:00:00.000Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the user was last updated.',
    example: '2025-01-15T12:00:00.000Z',
  })
  @IsDate()
  updatedAt: Date;


    /**
   * Converts a user document to a UserResponseDto.
   * @param document The user document to convert.
   * @returns A UserResponseDto instance.
   */
    static fromDocument(document: UserDocument): UserResponseDto {
        const dto = new UserResponseDto();
        dto.id = document._id.toString();
        dto.username = document.username;
        dto.preferences = document.preferences;
        dto.watchHistory    = document.watchHistory;
    
        return dto;
      }
}