import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { MyListService } from './my-list.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MyListItemResponseDto } from './dto/my-list-item-response.dto';
import { CreateMyListItemDto } from './dto/create-my-list-item.dto';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { MyListItemPopulatedResponseDto } from './dto/my-list-item-populated-response.dto';
import { PaginatedQueryDto } from '../shared/dto/paginated-query.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('My List')
@UseInterceptors(CacheInterceptor)
@ApiBearerAuth()
@Controller({ path: 'my-list', version: '1' })
export class MyListController {
  constructor(private readonly myListService: MyListService) {}

  @Post()
  @ApiOperation({
    summary: 'Add a movie or TV show to My List',
    description: "Adds a movie or TV show to the user's personalized list.",
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully added item to My List.',
    type: MyListItemResponseDto,
  })
  @ApiBearerAuth()
  async addToList(
    @Body() body: CreateMyListItemDto,
    @Request() { user: { _id: userId } },
  ): Promise<MyListItemResponseDto> {
    const item = await this.myListService.addToList(userId, body);
    return MyListItemResponseDto.fromDocument(item);
  }

  @Delete(':itemId')
  @ApiOperation({
    summary: 'Remove an item from My List',
    description:
      "Removes a movie or TV show from the user's personalized list.",
  })
  @ApiParam({
    name: 'itemId',
    description: 'ID of the item to be removed from My List',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully removed item from My List.',
  })
  async removeFromList(
    @Param('itemId') itemId: string,
    @Request() { user: { _id: userId } },
  ): Promise<void> {
    await this.myListService.removeFromList(userId, itemId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all items in My List',
    description:
      'Retrieves a paginated list of movies and TV shows saved in My List.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved items from My List.',
    type: PaginationDto<MyListItemPopulatedResponseDto>,
  })
  @ApiBearerAuth()
  async getMyList(
    @Request() { user },
    @Query() query: PaginatedQueryDto,
  ): Promise<PaginationDto<MyListItemPopulatedResponseDto>> {
    const { offset, limit } = query;

    const paginationData = await this.myListService.getMyList(
      user._id,
      offset,
      limit,
    );
    const itemsDto = paginationData.docs.map((item) =>
      MyListItemPopulatedResponseDto.fromDocument(item),
    );

    return {
      docs: itemsDto,
      pagination: paginationData.pagination,
    };
  }
}
