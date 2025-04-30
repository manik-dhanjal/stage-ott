// src/movies/dto/movie.dto.ts

import { IsString, IsOptional, IsDate, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Genre } from 'src/shared/enum/genre.enum';

export class MovieDto {
  @ApiProperty({
    description: 'The title of the movie.',
    example: 'Inception',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'A brief description or synopsis of the movie.',
    example:
      'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Genres associated with the movie.',
    example: ['Sci-Fi', 'Thriller'],
    enum: Genre,
    isArray: true,
  })
  @IsArray()
  @IsEnum(Genre, { each: true })
  genres: Genre[];

  @ApiProperty({
    description: 'The release date of the movie.',
    example: '2010-07-16T00:00:00.000Z',
  })
  @IsDate()
  releaseDate: Date;

  @ApiProperty({
    description: 'The name of the director of the movie.',
    example: 'Christopher Nolan',
  })
  @IsString()
  director: string;

  @ApiProperty({
    description: 'List of main actors in the movie.',
    example: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  actors?: string[];
}
