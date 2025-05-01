// src/user/dto/user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PreferencesDto } from './prefrences.dto';
import { WatchHistoryDto } from './watch-history.dto';

export class CreateUserDto {
  @ApiProperty({
    description: 'The unique username of the user.',
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'User preferences such as favorite and disliked genres.',
    type: PreferencesDto,
  })
  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences: PreferencesDto;

  @ApiProperty({
    description: 'List of watch history entries.',
    type: [WatchHistoryDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WatchHistoryDto)
  watchHistory: WatchHistoryDto[];

  @ApiProperty({
    description: 'Hashed password of the user.',
    example: '$2b$10$W9L...saf123sdf', // bcrypt hash example
  })
  @IsString()
  password: string;
}
