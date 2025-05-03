import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import inquirer from 'inquirer';
import { MovieSchema } from '../dist/movie/schema/movie.schema.js';
import { MyListItemSchema } from '../dist/my-list/schema/my-list-item.schema.js';
import { TVShowSchema } from '../dist/tv-show/schema/tv-show.schema.js';
import { UserSchema } from '../dist/user/schema/user.schema.js';

const MONGO_URI = process.env.DB_URL || 'mongodb://localhost:27017/stage'; // Replace with your MongoDB URI
const MOVIES_LIMIT = 100;
const TV_SHOWS_LIMIT = 100;
const SALT_ROUNDS = process.env.USER_PASSWORD_SALT_ROUNDS || 10; // Number of salt rounds for bcrypt

async function promptUser() {
  const defaultUsername = 'admin';
  const defaultPassword = 'admin123';

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Enter a username:',
      default: defaultUsername,
    },
    {
      type: 'input',
      name: 'password',
      message: 'Enter a password:',
      default: defaultPassword,
    },
  ]);

  return answers;
}

async function populateDatabase() {
  // Prompt for username and password
  const { username, password } = await promptUser();

  // Connect to MongoDB
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Define models
  const Movie = mongoose.model('Movie', MovieSchema);
  const TVShow = mongoose.model('TVShow', TVShowSchema);
  const MyList = mongoose.model('MyListItem', MyListItemSchema);
  const User = mongoose.model('User', UserSchema);

  // Clear existing data
  await Movie.deleteMany({});
  await TVShow.deleteMany({});
  await MyList.deleteMany({});
  await User.deleteMany({});
  console.log('Cleared existing data');

  // Define genres
  const genres = [
    'Action',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Romance',
    'SciFi',
  ];

  // Create a new user with preferences and watch history
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = await User.create({
    username,
    email: faker.internet.email(),
    password: hashedPassword, // Store the hashed password
    preferences: {
      favoriteGenres: faker.helpers.arrayElements(genres, 3),
      dislikedGenres: faker.helpers.arrayElements(genres, 2),
    },
    watchHistory: Array.from({ length: 5 }).map(() => ({
      contentId: faker.database.mongodbObjectId(),
      watchedOn: faker.date.past(),
      rating: faker.number.int({ min: 1, max: 5 }),
    })),
  });
  console.log('Created new user:', newUser.username);

  // Generate dummy movies
  const movies = Array.from({ length: MOVIES_LIMIT }).map(() => ({
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    genres: faker.helpers.arrayElements(genres, 2),
    releaseDate: faker.date.past(),
    director: faker.person.fullName(),
    actors: faker.helpers.arrayElements(
      Array.from({ length: 10 }).map(() => faker.person.fullName()),
      3,
    ),
  }));
  const movieDocs = await Movie.insertMany(movies);
  console.log('Inserted dummy movies');

  // Generate dummy TV shows
  const tvShows = Array.from({ length: TV_SHOWS_LIMIT }).map(() => ({
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    genres: faker.helpers.arrayElements(genres, 2),
    episodes: Array.from({ length: faker.number.int({ min: 5, max: 20 }) }).map(
      () => ({
        title: faker.lorem.words(2),
        description: faker.lorem.sentence(),
        duration: faker.number.int({ min: 20, max: 60 }), // Duration in minutes
        director: faker.person.fullName(),
        actors: faker.helpers.arrayElements(
          Array.from({ length: 10 }).map(() => faker.person.fullName()),
          3,
        ),
        releaseDate: faker.date.past(),
        seasonNumber: faker.number.int({ min: 1, max: 5 }),
        episodeNumber: faker.number.int({ min: 1, max: 20 }),
      }),
    ),
  }));
  const tvShowDocs = await TVShow.insertMany(tvShows);
  console.log('Inserted dummy TV shows');

  // Generate dummy MyList entries using the newly created user's ID
  const myListOfMovies = movieDocs.map((movie) => ({
    user: newUser._id,
    contentType: 'movie',
    movie: movie._id,
  }));
  const myListOfTvShows = tvShowDocs.map((tvShow) => ({
    user: newUser._id,
    contentType: 'tv-show',
    tvShow: tvShow._id,
  }));

  await MyList.insertMany([...myListOfMovies, ...myListOfTvShows]);
  console.log('Inserted dummy MyList entries');

  // Close the connection
  await mongoose.disconnect();
  console.log('Database population complete and connection closed');
}

populateDatabase().catch((err) => {
  console.error('Error populating database:', err);
  mongoose.disconnect();
});
