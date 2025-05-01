import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MyListItem, MyListItemDocument } from './schema/my-list-item.schema';
import { MyListItemDocumentPopulated } from './interface/my-list-item-document-populated.dto';

@Injectable()
export class MyListRepository {
  constructor(
    @InjectModel(MyListItem.name)
    private readonly myListModel: Model<MyListItemDocument>,
  ) {}

  async create(body: MyListItem): Promise<MyListItemDocument> {
    return this.myListModel.insertOne(body);
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
    offset = 1,
    limit = 10,
  ): Promise<MyListItemDocumentPopulated[]> {
    return this.myListModel
      .find({ user: userId })
      .skip(offset)
      .limit(limit)
      .populate(['movie', 'tvShow'])
      .lean<MyListItemDocumentPopulated[]>();
  }
}
