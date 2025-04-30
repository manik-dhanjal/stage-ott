import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MyListItem, MyListItemDocument } from './schema/my-list-item.schema';
import { ContentType } from 'src/shared/enum/content-type.enum';
import { MyListItemDocumentPopulated } from './interface/my-list-item-document-populated.dto';

@Injectable()
export class MyListRepository {
  constructor(
    @InjectModel(MyListItem.name)
    private readonly myListModel: Model<MyListItemDocument>,
  ) {}

  async create(body: MyListItem): Promise<MyListItemDocument> {
    return this.myListModel.create(body);
  }

  async delete(
    query: Partial<MyListItem & { _id: Types.ObjectId }>,
  ): Promise<boolean> {
    const result = await this.myListModel.deleteOne(query).exec();
    return result.deletedCount > 0;
  }

  async findOne(
    query: Partial<MyListItem & { _id: Types.ObjectId }>,
  ): Promise<MyListItemDocument | null> {
    return this.myListModel.findOne(query).exec();
  }

  async findPaginatedByUser(
    userId: Types.ObjectId,
    page = 1,
    limit = 10,
  ): Promise<MyListItemDocumentPopulated[]> {
    const skip = (page - 1) * limit;

    return this.myListModel
      .find({ user: userId })
      .skip(skip)
      .limit(limit)
      .populate('movie')
      .populate('tvShow')
      .lean() as Promise<MyListItemDocumentPopulated[]>;
  }
}
