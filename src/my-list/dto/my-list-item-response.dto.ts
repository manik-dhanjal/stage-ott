import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { MyListItemDocument } from '../schema/my-list-item.schema';
import { CreateMyListItemDto } from './create-my-list-item.dto';

export class MyListItemResponseDto extends CreateMyListItemDto{
  @ApiProperty({
    description: 'Unique identifier for the list item.',
    example: '66317de2e2b157cdce6f891a',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The date when the list item was created.',
    example: '2025-01-01T12:00:00.000Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the list item was last updated.',
    example: '2025-01-15T12:00:00.000Z',
  })
  @IsDate()
  updatedAt: Date;

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
