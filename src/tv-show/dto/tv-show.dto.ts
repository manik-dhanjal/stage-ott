// src/tv-show/dto/tv-show.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Genre } from 'src/shared/enum/genre.enum'; // Assuming Genre enum is already defined
import { EpisodeDto } from './episode.dto';

export class TVShowDto {
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
}
