import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyListItem, MyListItemSchema } from './schema/my-list-item.schema';
import { MyListController } from './my-list.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MyListItem.name, schema: MyListItemSchema },
    ]),
  ],
  controllers: [MyListController],
  providers: [],
  exports: [],
})
export class MyListModule {}
