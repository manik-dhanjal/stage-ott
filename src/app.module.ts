import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyListModule } from './my-list/my-list.module';
import { TVShowModule } from './tv-show/tv-show.module';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [MovieModule, TVShowModule, MyListModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
