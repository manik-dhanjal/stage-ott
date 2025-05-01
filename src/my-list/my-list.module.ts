import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyListItem, MyListItemSchema } from './schema/my-list-item.schema';
import { MyListController } from './my-list.controller';
import { MyListService } from './my-list.service';
import { MyListRepository } from './my-list.repository';
import { MovieModule } from '../movie/movie.module';
import { TVShowModule } from '../tv-show/tv-show.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MyListItem.name, schema: MyListItemSchema },
    ]),
    MovieModule,
    TVShowModule,
  ],
  controllers: [MyListController],
  providers: [MyListService, MyListRepository],
  exports: [MyListService, MyListRepository],
})
export class MyListModule {}
