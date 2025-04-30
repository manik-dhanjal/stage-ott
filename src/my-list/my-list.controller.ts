import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MyListService } from './my-list.service';
import { ContentType } from 'src/shared/enum/content-type.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MyListItemResponseDto } from './dto/my-list-item-response.dto';
import { MyListItemRequestDto } from './dto/my-list-item-request.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { MyListItemPopulatedResponseDto } from './dto/my-list-item-populated-response.dto';

@ApiTags('My List')
@Controller('my-list')
// @UseGuards(JwtAuthGuard) // Assuming you're using JWT authentication
export class MyListController {
  constructor(private readonly myListService: MyListService) {}

  @Post('add')
  @ApiOperation({
    summary: 'Add a movie or TV show to My List',
    description: "Adds a movie or TV show to the user's personalized list.",
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully added item to My List.',
    type: MyListItemResponseDto,
  })
  async addToList(
    @Body() body: MyListItemRequestDto,
  ): Promise<MyListItemResponseDto> {
    const item = await this.myListService.addToList('userId', body);
    return MyListItemResponseDto.fromDocument(item);
  }

  @Delete('remove/:itemId')
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
    @Body('userId') userId: string, // Typically, you can extract the userId from the JWT token
  ): Promise<void> {
    await this.myListService.removeFromList(userId, itemId);
  }

  @Get('list')
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
  async getMyList(
    @Query('userId') userId: string, // Typically, you can extract the userId from the JWT token
    @Query('offset') offset = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginationDto<MyListItemPopulatedResponseDto>> {
    const paginationData = await this.myListService.getMyList(
      userId,
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
