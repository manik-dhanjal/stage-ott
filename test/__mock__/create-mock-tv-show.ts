import { faker } from '@faker-js/faker';
import { Genre } from '../../src/shared/enum/genre.enum';
import { TVShow } from '../../src/tv-show/schema/tv-show.schema';
import { Episode } from '../../src/tv-show/schema/episode.schema';

/**
 * Creates a mock episode.
 * @param override Optional fields to override the generated episode.
 * @returns A mock Episode object.
 */
export function createMockEpisode(override?: Partial<Episode>): Episode {
  return {
    releaseDate: faker.date.past(),
    seasonNumber: faker.number.int({ min: 1, max: 5 }),
    episodeNumber: faker.number.int({ min: 1, max: 20 }),
    director: faker.person.fullName(),
    actors: Array.from({ length: 3 }).map(() => faker.person.fullName()),
    ...override,
  };
}

/**
 * Creates a mock TV show.
 * @param override Optional fields to override the generated TV show.
 * @returns A mock TVShow object.
 */
export function createMockTVShow(override?: Partial<TVShow>): TVShow {
  return {
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    genres: faker.helpers.arrayElements(Object.values(Genre), 2),
    episodes: Array.from({ length: 5 }).map(() => createMockEpisode()),
    ...override,
  } as TVShow;
}