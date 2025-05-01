import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsObject, IsPositive, IsString } from 'class-validator';

export class UserTokenDto {
  @ApiProperty({
    description: 'JWT token for API authentication',
    example: 'abcd1234accessTokenExample',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Time in milliseconds until the access token expires',
    example: 300000, // 5mins
  })
  @IsInt()
  @IsPositive()
  expiresIn: number;

  @ApiProperty({
    description: 'Unix based time in milliseconds',
    example: 1735386822544, // 5mins
  })
  @IsInt()
  @IsPositive()
  expiresOn: number;
}


export class UserTokensDto {
  @ApiProperty()
  @IsObject()
  @Type(() => UserTokenDto)
  refresh: UserTokenDto;

  @ApiProperty()
  @IsObject()
  @Type(() => UserTokenDto)
  access: UserTokenDto;
}