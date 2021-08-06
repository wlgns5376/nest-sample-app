import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Connection } from 'mongoose';
import { DatabaseService } from '../src/database/database.service';
import { CreateReviewDto } from '../src/reviews/dto/create-review.dto';
import { UpdateReviewDto } from 'src/reviews/dto/update-review.dto';

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection: Connection;

  const mockReview = (): CreateReviewDto => ({
    product_id: 1,
    name: 'Tom',
    description: 'This is good'
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getConnection();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
    await dbConnection.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('reviews').deleteMany({});
  });

  it('/reviews (GET)', async () => {
    // 임의의 데이터 삽입.
    await dbConnection.collection('reviews').insertOne(mockReview());
    const response = await request(httpServer).get('/reviews');

    expect(response.status).toBe(200);
    // 변수를 배열로 담으면 추가 데이터가 생겨나서 match 실패 됨. 아마도 참조 데이터가 붙는 것 같음
    expect(response.body).toMatchObject([mockReview()]);
  });

  it('/reviews (POST)', async () => {
    const createDto: CreateReviewDto = {
      ...mockReview()
    }
    const response = await request(httpServer).post('/reviews').send(createDto);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(createDto);
  });

  it('/reviews/:id (GET)', async () => {
    const result = await dbConnection.collection('reviews').insertOne(mockReview());
    const response = await request(httpServer).get('/reviews/' + result.insertedId);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(mockReview());
    expect(response.body._id == result.insertedId).toBeTruthy();
    //expect(response.body._id).toEqual(result.insertedId); // serializes to the same string
  });

  it('/reviews/:id (GET) NotFound', async () => {
    await request(httpServer).get('/reviews/a1')
      .expect(404);
  });

  it('/reviews/:id (PATCH)', async () => {
    const result = await dbConnection.collection('reviews').insertOne(mockReview());
    const updateDto: UpdateReviewDto = {
      description: 'This is great'
    }
    const response = await request(httpServer).patch('/reviews/' + result.insertedId).send(updateDto);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updateDto);

  });

  it('/reviews/:id (PATCH) NotFound', async () => {
    const updateDto: UpdateReviewDto = {
      description: 'This is great'
    }

    await request(httpServer).patch('/reviews/a1').send(updateDto)
      .expect(404);
  });

  it('/reviews/:id (DELETE)', async () => {
    const result = await dbConnection.collection('reviews').insertOne(mockReview());
    const response = await request(httpServer).delete('/reviews/' + result.insertedId);

    expect(response.status).toBe(200);
    expect(response.text).toBe("OK");
  });

  it('/reviews/:id (DELETE) NotFound', async () => {
    await request(httpServer).delete('/reviews/a1')
      .expect(404);
  });
});
