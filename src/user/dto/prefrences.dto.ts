import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';
import { Genre } from '../../shared/enum/genre.enum';

export class PreferencesDto {
  @ApiProperty({
    description: 'User’s favorite genres.',
    example: ['Action', 'Comedy'],
    enum: Genre,
    isArray: true,
  })
  @IsArray()
  @IsEnum(Genre, { each: true })
  favoriteGenres: Genre[];

  @ApiProperty({
    description: 'Genres the user dislikes.',
    example: ['Horror'],
    enum: Genre,
    isArray: true,
  })
  @IsArray()
  @IsEnum(Genre, { each: true })
  dislikedGenres: Genre[];
}
