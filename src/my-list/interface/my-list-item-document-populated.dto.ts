import { Movie } from '../../movie/schema/movie.schema';
import { TVShow } from '../../tv-show/schema/tv-show.schema';
import { MyListItemDocument } from '../schema/my-list-item.schema';

export interface MyListItemDocumentPopulated
  extends Omit<MyListItemDocument, 'movie' | 'tvShow'> {
  movie?: Movie;
  tvShow?: TVShow;
}
