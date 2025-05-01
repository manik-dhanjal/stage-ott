import { faker } from '@faker-js/faker';
import { User } from '../../src/user/schema/user.schema';
import { Genre } from '../../src/shared/enum/genre.enum';

export function createMockUser(override?: Partial<User>): User {
  return {
    username: faker.internet.username(),
    password: faker.internet.password(),
    preferences: {
      favoriteGenres: faker.helpers.arrayElements(Object.values(Genre), 3),
      dislikedGenres: faker.helpers.arrayElements(Object.values(Genre), 2),
    },
    watchHistory: Array.from({ length: 5 }).map(() => ({
      contentId: faker.database.mongodbObjectId(),
      watchedOn: faker.date.past(),
      rating: faker.number.int({ min: 1, max: 5 }),
    })),
    ...override
  } as User;
}