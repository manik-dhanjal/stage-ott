import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { MyListRepository } from './my-list.repository';
import { Types } from 'mongoose';
import { ContentType } from 'src/shared/enum/content-type.enum';
import { MyListItemDocument } from './schema/my-list-item.schema';
import { MyListItemDocumentPopulated } from './interface/my-list-item-document-populated.dto';
import { Pagination } from 'src/shared/interface/pagination.interface';
import { MyListItemRequestDto } from './dto/my-list-item-request.dto';
import { MovieRepository } from 'src/movie/movie.repository';
import { TVShowRepository } from 'src/tv-show/tv-show.repository';

@Injectable()
export class MyListService {
  constructor(
    private readonly myListRepository: MyListRepository,
    private readonly movieRepository: MovieRepository,
    private readonly tvShowRepository: TVShowRepository,
  ) {}

  async addToList(
    userId: string,
    body: MyListItemRequestDto,
  ): Promise<MyListItemDocument> {
    const userObjectId = new Types.ObjectId(userId);

    let validContent = false;

    if (body.contentType == ContentType.MOVIE) {
      validContent = !!(await this.movieRepository.findById(body.contentId));
    } else if (body.contentType == ContentType.TV_SHOW) {
      validContent = !!(await this.tvShowRepository.findById(body.contentId));
    }

    if (!validContent) {
      throw new BadRequestException(
        `Content with ID ${body.contentId} does not exist in the database`,
      );
    }

    // Check if item already exists
    const existing = await this.myListRepository.findOne({
      user: userObjectId,
      [body.contentType === ContentType.MOVIE ? 'movie' : 'tvShow']:
        new Types.ObjectId(body.contentId),
    });

    if (existing) {
      throw new ConflictException('Content already in My List');
    }

    return this.myListRepository.create({
      user: userObjectId,
      [body.contentType === ContentType.MOVIE ? 'movie' : 'tvShow']:
        new Types.ObjectId(body.contentId),
      contentType: body.contentType,
    });
  }

  async removeFromList(userId: string, itemId: string): Promise<void> {
    if (!Types.ObjectId.isValid(itemId)) {
      throw new BadRequestException('Invalid item ID');
    }

    const userObjectId = new Types.ObjectId(userId);
    const itemObjectId = new Types.ObjectId(itemId);

    const deleted = await this.myListRepository.delete({
      user: userObjectId,
      _id: itemObjectId,
    });

    if (!deleted) {
      throw new NotFoundException('Content not found in My List');
    }
  }

  async getMyList(
    userId: string,
    offset = 1,
    limit = 10,
  ): Promise<Pagination<MyListItemDocumentPopulated>> {
    const userObjectId = new Types.ObjectId(userId);

    const items = await this.myListRepository.findPaginatedByUser(
      userObjectId,
      offset,
      limit,
    );

    return {
      docs: items,
      pagination: {
        offset,
        limit,
        count: items.length,
      },
    };
  }
}
