import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class PaginatedQueryDto {
  @ApiProperty({
    description: 'The number of items to skip before starting to collect the result set.',
    example: 0,
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 0))
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({
    description: 'The number of items to return.',
    example: 10,
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}