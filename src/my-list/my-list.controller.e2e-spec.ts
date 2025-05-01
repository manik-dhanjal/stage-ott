import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import request from 'supertest';
import { MongoContainer } from '../../test/test-container-support/mongo-container.utils';
import { CreateMyListItemDto } from './dto/create-my-list-item.dto';
import { ContentType } from '../shared/enum/content-type.enum';
import { createMockUser } from '../../test/__mock__/create-mock-user';
import { Movie, MovieSchema } from '../movie/schema/movie.schema';
import { Model, Types } from 'mongoose';
import { TVShow, TVShowSchema } from '../tv-show/schema/tv-show.schema';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { createMockMovie } from '../../test/__mock__/create-mock-movie';
import { createMockTVShow } from '../../test/__mock__/create-mock-tv-show';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { USER_CONFIG_NAME, userConfig } from '../shared/config/user.config';
import { MyListItem, MyListItemSchema } from './schema/my-list-item.schema';
import { User, UserSchema } from '../user/schema/user.schema';
import { MyListModule } from './my-list.module';
import { UserModule } from '../user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisContainer } from '../../test/test-container-support/redis-container.utils';
import { RedisStore } from 'cache-manager-redis-store';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../shared/gaurd/auth.gaurd';
import { UserResponseDto } from '@root/user/dto/user-response.dto';

jest.setTimeout(30000); // Set timeout for the tests

describe('MyListController (e2e)', () => {
  let app: INestApplication;
  let mongoContainer: MongoContainer;
  let mongoUri: string;
  let redisContainer: RedisContainer;
  let redisStore: RedisStore;
  let accessToken: string;
  let movieModel: Model<Movie>;
  let tvShowModel: Model<TVShow>;
  let mylistModel: Model<MyListItem>;
  let testUser: UserResponseDto;

  beforeAll(async () => {
    mongoContainer = new MongoContainer();
    mongoUri = await mongoContainer.start();

    redisContainer = new RedisContainer();
    redisStore = await redisContainer.start();

    // Create Testing Module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri, {
          dbName: 'test',
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [userConfig],
        }),
        MongooseModule.forFeature([
          { name: Movie.name, schema: MovieSchema },
          { name: TVShow.name, schema: TVShowSchema },
          { name: MyListItem.name, schema: MyListItemSchema },
          { name: User.name, schema: UserSchema },
        ]),
        MyListModule,
        UserModule,
        CacheModule.register({
          isGlobal: true,
          store: redisStore,
        }),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          if (key === USER_CONFIG_NAME) {
            return {
              jwtSecret: 'secret',
              accessJwtExpiresIn: 600000000,
              refreshJwtExpiresIn: 600000000,
              passwordSaltRounds: 10,
            };
          }
          return null;
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();
    app.enableVersioning({
      type: VersioningType.URI,
    });
    await app.init();

    // Get Mongoose models
    movieModel = app.get<Model<Movie>>(getModelToken(Movie.name));
    tvShowModel = app.get<Model<TVShow>>(getModelToken(TVShow.name));
    mylistModel = app.get<Model<MyListItem>>(getModelToken(MyListItem.name));
  });

  afterAll(async () => {
    await mongoContainer.stop();
    await redisContainer.stop();
    await app.close();
  });

  beforeAll(async () => {
    // Create a test user and get an access token
    const mockUser = createMockUser();
    const authResponse = await request(app.getHttpServer())
      .post('/v1/user/register')
      .send(mockUser);
    accessToken = authResponse.body?.access?.token;

    const userMeResponse = await request(app.getHttpServer())
      .get('/v1/user/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    testUser = userMeResponse.body;
  });

  afterEach(async () => {
    // Clean up the database after each test
    await movieModel.deleteMany({});
    await tvShowModel.deleteMany({});
    await mylistModel.deleteMany({});

    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('POST /v1/my-list', () => {
    // Test for adding a movie
    it('should add an Movie to My List', async () => {
      const mockMovieToInsert = createMockMovie();
      const insertedMovieDoc = await movieModel.insertOne(mockMovieToInsert);
      const createDto: CreateMyListItemDto = {
        contentType: ContentType.MOVIE,
        contentId: insertedMovieDoc._id.toString(), // Example ObjectId
      };

      const response = await request(app.getHttpServer())
        .post('/v1/my-list')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createDto);

      console.log('response.body', response.body);
      expect(response.body).toMatchObject(createDto);
      expect(response.status).toBe(201);
      // Check if the item was added to the database
      const itemInDb = await mylistModel.findById(response.body.id).exec();

      expect(itemInDb).toBeDefined();
      expect(itemInDb?.contentType).toBe(createDto.contentType);
      expect(itemInDb?.movie?.toString()).toBe(createDto.contentId);
      expect(itemInDb?.tvShow).toBeUndefined();
      expect(itemInDb?.user.toString()).toBe(testUser.id.toString());
    });
    // Test for adding a TV show
    it('should add a TV show to My List', async () => {
      const mockTVShowToInsert = createMockTVShow();
      const insertedTVShowDoc = await tvShowModel.insertOne(mockTVShowToInsert);

      const createDto: CreateMyListItemDto = {
        contentType: ContentType.TV_SHOW,
        contentId: insertedTVShowDoc._id.toString(), // Example ObjectId
      };

      const response = await request(app.getHttpServer())
        .post('/v1/my-list')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createDto);

      expect(response.body).toMatchObject(createDto);
      expect(response.status).toBe(201);
      // Check if the item was added to the database
      const itemInDb = await mylistModel.findById(response.body.id).exec();

      expect(itemInDb).toBeDefined();
      expect(itemInDb?.contentType).toBe(createDto.contentType);
      expect(itemInDb?.tvShow?.toString()).toBe(createDto.contentId);
      expect(itemInDb?.movie).toBeUndefined();
      expect(itemInDb?.user.toString()).toBe(testUser.id.toString());
    });

    // Test for adding an item that already exists
    it('should return 409 Conflict if item already exists in My List', async () => {
      const mockMovieToInsert = createMockMovie();
      const insertedMovieDoc = await movieModel.insertOne(mockMovieToInsert);

      const createDto: CreateMyListItemDto = {
        contentType: ContentType.MOVIE,
        contentId: insertedMovieDoc._id.toString(), // Example ObjectId
      };

      // First, add the item to My List
      await request(app.getHttpServer())
        .post('/v1/my-list')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createDto)
        .expect(201);

      // Try to add the same item again
      const response = await request(app.getHttpServer())
        .post('/v1/my-list')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createDto);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Content already in My List');
    });

    // Test for adding an item that does not exist in the database
    it('should return 400 Bad Request if content does not exist in the database', async () => {
      const createDto: CreateMyListItemDto = {
        contentType: ContentType.MOVIE,
        contentId: new Types.ObjectId().toString(), // Non-existent ObjectId
      };

      const response = await request(app.getHttpServer())
        .post('/v1/my-list')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createDto);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        `Content with ID ${createDto.contentId} does not exist in the database`,
      );
    });

    // Test for adding an item with invalid content type
    it('should return 400 Bad Request if content type is invalid', async () => {
      const createDto: CreateMyListItemDto = {
        contentType: 'INVALID_CONTENT_TYPE' as ContentType,
        contentId: new Types.ObjectId().toString(), // Example ObjectId
      };

      const response = await request(app.getHttpServer())
        .post('/v1/my-list')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createDto);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        'contentType must be one of the following values: movie, tv-show',
      );
    });
  });

  describe('GET /v1/my-list', () => {
    // Test for retrieving all items in My List
    it('should retrieve all items in My List', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/my-list')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ offset: 0, limit: 10 })
        .expect(200);

      expect(response.body.docs).toBeInstanceOf(Array);
      expect(response.body.pagination).toMatchObject({
        offset: 0,
        limit: 10,
        count: 0,
      });
    });

    // Test for retrieving items with pagination
    it('should retrieve items with pagination', async () => {
      const mockMovieToInsert = createMockMovie();
      const insertedMovieDoc = await movieModel.insertOne(mockMovieToInsert);

      const mockTVShowToInsert = createMockTVShow();
      const insertedTVShowDoc = await tvShowModel.insertOne(mockTVShowToInsert);

      await mylistModel.insertMany([
        {
          user: testUser.id,
          movie: insertedMovieDoc._id,
          contentType: ContentType.MOVIE,
        },
        {
          user: testUser.id,
          tvShow: insertedTVShowDoc._id,
          contentType: ContentType.TV_SHOW,
        },
      ]);

      const response1 = await request(app.getHttpServer())
        .get('/v1/my-list')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ offset: 0, limit: 1 })
        .expect(200);

      const response2 = await request(app.getHttpServer())
        .get('/v1/my-list')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ offset: 1, limit: 1 })
        .expect(200);

      expect(response1.body.docs).toBeInstanceOf(Array);
      expect(response1.body.docs.length).toBe(1);
      expect(response1.body.pagination).toMatchObject({
        offset: 0,
        limit: 1,
        count: 1,
      });
      expect(response2.body.docs).toBeInstanceOf(Array);
      expect(response2.body.docs.length).toBe(1);
      expect(response2.body.pagination).toMatchObject({
        offset: 1,
        limit: 1,
        count: 1,
      });
    });

    // Test for retrieving items with invalid pagination parameters
    it('should return 400 Bad Request for invalid pagination parameters', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/my-list')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ offset: -1, limit: 0 })
        .expect(400);

      expect(response.body.message).toContain('offset must not be less than 0');
      expect(response.body.message).toContain('limit must not be less than 1');
    });
  });

  describe('DELETE /v1/my-list/:itemId', () => {
    // Test for removing an item from My List
    it('should remove an item from My List', async () => {
      const mockMovieToInsert = createMockMovie();
      console.log('mockMovieToInsert', mockMovieToInsert);
      const insertedMovieDoc = await movieModel.insertOne(mockMovieToInsert);

      const insertedListItemDoc = await mylistModel.insertOne({
        user: testUser.id,
        movie: insertedMovieDoc._id,
        contentType: ContentType.MOVIE,
      });
      // Remove the item
      await request(app.getHttpServer())
        .delete(`/v1/my-list/${insertedListItemDoc._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Check if the item was removed from the database
      const itemInDb = await mylistModel
        .findOne({
          user: testUser.id,
          movie: insertedMovieDoc._id,
        })
        .exec();
      expect(itemInDb).toBeNull();
    });

    // Test for removing an item that does not exist
    it('should return 404 Not Found if item does not exist in My List', async () => {
      const mockMovieToInsert = createMockMovie();
      const insertedMovieDoc = await movieModel.insertOne(mockMovieToInsert);

      const insertedListItemDoc = await mylistModel.insertOne({
        user: testUser.id,
        movie: insertedMovieDoc._id,
        contentType: ContentType.MOVIE,
      });

      // Remove the item
      await request(app.getHttpServer())
        .delete(`/v1/my-list/${insertedListItemDoc._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Try to remove the same item again
      const response = await request(app.getHttpServer())
        .delete(`/v1/my-list/${insertedListItemDoc._id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Content not found in My List');
    });

    // Test for removing an item with invalid ID
    it('should return 400 Bad Request for invalid item ID', async () => {
      const invalidItemId = 'invalid-id';

      const response = await request(app.getHttpServer())
        .delete(`/v1/my-list/${invalidItemId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid item ID');
    });
  });
});
