import { Module } from '@nestjs/common';
import { TVShowRepository } from './tv-show.repository';
import { TVShowService } from './tv-show.service';
import { TVShow, TVShowSchema } from './schema/tv-show.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TVShow.name, schema: TVShowSchema }]),
  ],
  providers: [TVShowRepository, TVShowService],
  exports: [TVShowRepository, TVShowService],
})
export class TVShowModule {}
