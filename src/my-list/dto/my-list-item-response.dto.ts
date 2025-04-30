import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ContentType } from 'src/shared/enum/content-type.enum';
import { MyListItemDocument } from '../schema/my-list-item.schema';

export class MyListItemResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the list item.',
    example: '66317de2e2b157cdce6f891a',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Type of content (e.g., Movie, TV Show).',
    example: ContentType.MOVIE,
    enum: ContentType,
  })
  @IsString()
  @IsEnum(ContentType)
  contentType: ContentType;

  @ApiProperty({
    description:
      'Unique identifier for the content (either a movie or a TV show).',
    example: '66317de2e2b157cdce6f891a',
  })
  @IsMongoId({ message: 'contentId must be a valid MongoDB ObjectId' })
  contentId: string;

  /**
   * Converts a MyListItemDocument to a MyListItemResponseDto.
   * @param document The MyListItemDocument to convert.
   * @returns A MyListItemResponseDto instance.
   */
  static fromDocument(document: MyListItemDocument): MyListItemResponseDto {
    const dto = new MyListItemResponseDto();
    dto.id = document._id.toString();
    dto.contentType = document.contentType;
    dto.contentId =
      document.movie?.toString() || (document.tvShow?.toString() as string);
    return dto;
  }
}
