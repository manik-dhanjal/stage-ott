import { IsObject } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { MovieDto } from '../../movie/dto/movie.dto';
import { TVShowDto } from '../../tv-show/dto/tv-show.dto';
import { ContentType } from '../../shared/enum/content-type.enum';
import { MyListItemDocumentPopulated } from '../interface/my-list-item-document-populated.dto';
import { MyListItemResponseDto } from './my-list-item-response.dto';
import { MovieDocument } from '../../movie/schema/movie.schema';
import { TVShowDocument } from '../../tv-show/schema/tv-show.schema';

export class MyListItemPopulatedResponseDto extends OmitType(
  MyListItemResponseDto,
  [ 'contentId'],
) {

  @ApiProperty({
    description:
      'Associated content information (either a movie or a TV show).',
    oneOf: [{ $ref: 'MovieDto' }, { $ref: 'TVShowDto' }],
    required: false,
  })
  @IsObject()
  content: MovieDto | TVShowDto;


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
      dto.content = MovieDto.fromDocument(document.movie as MovieDocument);
    } else if (
      document.contentType === ContentType.TV_SHOW &&
      document.tvShow
    ) {
      dto.content = TVShowDto.fromDocument(document.tvShow as TVShowDocument);
    }

    return dto;
  }
}
