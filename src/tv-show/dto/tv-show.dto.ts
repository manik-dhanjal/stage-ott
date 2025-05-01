// src/tv-show/dto/tv-show.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, IsDate } from 'class-validator';
import { Genre } from '../../shared/enum/genre.enum'; // Assuming Genre enum is already defined
import { EpisodeDto } from './episode.dto';
import { TVShowDocument } from '../schema/tv-show.schema';

export class TVShowDto {

    @ApiProperty({
        description: 'The unique identifier of the TV show.',
        example: '1234567890abcdef12345678',
    })
    @IsString()
    id: string;

  @ApiProperty({
    description: 'The title of the TV show.',
    example: 'Breaking Bad',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'A short description of the TV show.',
    example:
      'A high school chemistry teacher turned methamphetamine manufacturer.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Genres associated with the TV show.',
    example: ['Drama', 'Crime'],
    enum: Genre,
    isArray: true,
  })
  @IsArray()
  @IsEnum(Genre, { each: true })
  genres: Genre[];

  @ApiProperty({
    description: 'List of episodes in the TV show.',
    type: [EpisodeDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  episodes?: EpisodeDto[];

  @ApiProperty({
    description: 'The date when the TV show record was created.',
    example: '2025-01-01T12:00:00.000Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the TV show record was last updated.',
    example: '2025-01-15T12:00:00.000Z',
  })
  @IsDate()
  updatedAt: Date;


    /**
   * Converts a TVShow document to a TVShowDto instance.
   * @param document The TVShow document to convert.
   * @returns A TVShowDto instance.
   */
    static fromDocument(document: TVShowDocument): TVShowDto {
        const dto = new TVShowDto();
        dto.id = document._id.toString();
        dto.title = document.title;
        dto.description = document.description;
        dto.genres = document.genres;
        dto.episodes = document.episodes?.map((episode) =>
          EpisodeDto.fromDocument(episode),
        );
        return dto;
    }
}
