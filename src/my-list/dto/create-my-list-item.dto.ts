import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { ContentType } from 'src/shared/enum/content-type.enum';

export class CreateMyListItemDto {
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
}
