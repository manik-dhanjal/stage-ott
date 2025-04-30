// src/tv-show/dto/episode.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsArray,
} from 'class-validator';

export class EpisodeDto {
  @ApiProperty({
    description: 'The episode number in the season.',
    example: 1,
  })
  @IsNumber()
  episodeNumber: number;

  @ApiProperty({
    description: 'The season number this episode belongs to.',
    example: 1,
  })
  @IsNumber()
  seasonNumber: number;

  @ApiProperty({
    description: 'The release date of the episode.',
    example: '2023-12-25T00:00:00.000Z',
  })
  @IsDate()
  releaseDate: Date;

  @ApiProperty({
    description: 'The director of the episode.',
    example: 'John Doe',
  })
  @IsString()
  director: string;

  @ApiProperty({
    description: 'The actors who starred in this episode.',
    example: ['Actor 1', 'Actor 2'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  actors?: string[];
}
