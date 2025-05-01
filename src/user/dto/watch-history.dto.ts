import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsDate, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class WatchHistoryDto {
  @ApiProperty({
    description: 'ID of the content watched.',
    example: '663183f8aef4bde4e8f62f8e',
  })
  @IsString()
  contentId: string;

  @ApiProperty({
    description: 'Date when the content was watched.',
    example: '2024-12-25T14:00:00.000Z',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  watchedOn: Date;

  @ApiProperty({
    description: 'Optional rating given by the user.',
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  rating?: number;
}
