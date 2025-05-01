// src/shared/dto/pagination.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

class PaginationMetaDto {
  @ApiProperty({ description: 'The offset used in the query.', example: 0 })
  @IsNumber()
  offset: number;

  @ApiProperty({ description: 'The number of items per page.', example: 10 })
  @IsNumber()
  limit: number;

  @ApiProperty({
    description: 'The total number of items fetched.',
    example: 10,
  })
  @IsNumber()
  count: number;
}

export class PaginationDto<T> {
  @ApiProperty({
    description: 'The list of items returned for this page.',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object) // You must override this with the actual class when using it
  docs: T[];

  @ApiProperty({ description: 'Pagination metadata.' })
  @ValidateNested()
  @Type(() => PaginationMetaDto)
  pagination: PaginationMetaDto;
}
