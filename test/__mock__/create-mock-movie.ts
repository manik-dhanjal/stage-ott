import { faker } from '@faker-js/faker';
import { Genre } from '../../src/shared/enum/genre.enum';
import { Movie } from '../../src/movie/schema/movie.schema';

export function createMockMovie(override?: Partial<Movie>): Movie {
  return {
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    genres: faker.helpers.arrayElements(Object.values(Genre), 2),
    releaseDate: faker.date.past(),
    director: faker.person.fullName(),
    actors: Array.from({ length: 3 }).map(() => faker.person.fullName()),
    ...override
  };
}