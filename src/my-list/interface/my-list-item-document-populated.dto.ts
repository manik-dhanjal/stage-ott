import { Movie } from 'src/movie/schema/movies.schema';
import { TVShow } from 'src/tv-show/schema/tv-show.schema';
import { MyListItemDocument } from '../schema/my-list-item.schema';

export interface MyListItemDocumentPopulated
  extends Omit<MyListItemDocument, 'movie' | 'tvShow'> {
  movie?: Movie;
  tvShow?: TVShow;
}
