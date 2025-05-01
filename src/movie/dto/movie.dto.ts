// src/movies/dto/movie.dto.ts

import { IsString, IsOptional, IsDate, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Genre } from 'src/shared/enum/genre.enum';
import { MovieDocument } from '../schema/movies.schema';

export class MovieDto {
    @ApiProperty({
        description: 'The unique identifier of the movie.',
        example: '60d5ec49f1b2c8a3d4e8b456',
    })
    @IsString()
    id: string;

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

  @ApiProperty({
    description: 'The date when the movie record was created.',
    example: '2025-01-01T12:00:00.000Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the movie record was last updated.',
    example: '2025-01-15T12:00:00.000Z',
  })
  @IsDate()
  updatedAt: Date;

    /**
   * Converts a Movie document to a MovieDto instance.
   * @param document The Movie document to convert.
   * @returns A MovieDto instance.
   */
    static fromDocument(document: MovieDocument): MovieDto {
        const dto = new MovieDto();
        dto.id = document._id.toString();
        dto.title = document.title;
        dto.description = document.description;
        dto.genres = document.genres;
        dto.releaseDate = document.releaseDate;
        dto.director = document.director;
        dto.actors = document.actors;
        return dto;
    }
}
