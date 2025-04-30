import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MovieDto } from 'src/movie/dto/movie.dto';
import { TVShowDto } from 'src/tv-show/dto/tv-show.dto';
import { ContentType } from 'src/shared/enum/content-type.enum';
import { MyListItemDocumentPopulated } from '../interface/my-list-item-document-populated.dto';

export class MyListItemPopulatedResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the list item.',
    example: '66317de2e2b157cdce6f891a',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description:
      'Associated content information (either a movie or a TV show).',
    oneOf: [{ $ref: 'MovieDto' }, { $ref: 'TVShowDto' }],
    required: false,
  })
  @IsObject()
  content: MovieDto | TVShowDto;

  @ApiProperty({
    description: 'Type of content (e.g., Movie, TV Show).',
    example: ContentType.MOVIE,
    enum: ContentType,
  })
  @IsString()
  @IsEnum(ContentType)
  contentType: ContentType;

  /**
   * Converts a MyListItemDocument to a MyListItemPopulatedResponseDto.
   * @param document The MyListItemDocument to convert.
   * @returns A MyListItemPopulatedResponseDto instance.
   */
  static fromDocument(
    document: MyListItemDocumentPopulated,
  ): MyListItemPopulatedResponseDto {
    const dto = new MyListItemPopulatedResponseDto();
    dto.id = document._id.toString();
    dto.contentType = document.contentType;

    // Assign the populated content (either MovieDto or TVShowDto)
    if (document.contentType === ContentType.MOVIE && document.movie) {
      dto.content = document.movie as MovieDto;
    } else if (
      document.contentType === ContentType.TV_SHOW &&
      document.tvShow
    ) {
      dto.content = document.tvShow as TVShowDto;
    }

    return dto;
  }
}
