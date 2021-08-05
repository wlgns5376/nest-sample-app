import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewMockModel } from './mock/review.mock';

describe('ReviewsController 테스트', () => {
  let controller: ReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        ReviewsService,
        {
          provide: getModelToken(Review.name),
          useValue: ReviewMockModel,
        }
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll 결과는 Array 타입', async () => {
    let reviews = await controller.findAll();

    expect(reviews).toBeInstanceOf(Array);
  });

  it('Create는 Object로 반환된다.', async () => {    
    const createReviewDto: CreateReviewDto = new CreateReviewDto();
    createReviewDto.product_id = 1;
    createReviewDto.name = 'Tom';
    createReviewDto.description = 'This is good.';

    // save 메서드는 static이 아니라서 prototype으로 감시
    const spyReview = jest.spyOn(ReviewMockModel.prototype, 'save');
    const result = await controller.create(createReviewDto);
    
    // save 메서드가 실행됐는지 확인
    expect(spyReview).toBeCalled();

    const resExpect = expect(result);
    // Object로 리턴되는지 확인
    resExpect.toBeInstanceOf(Object);
    // 결과가 요청값과 동일한지 확인
    resExpect.toHaveProperty('product_id', createReviewDto.product_id);

  });


  it('id로 Review 조회', async () => {
    const reviewId: any = 'a1';
    const result = await controller.findOne(reviewId);

    expect(result).toHaveProperty('_id', reviewId);
  });

  it('id로 Review 수정', async () => {
    const reviewId: string = 'a1';
    const updatedDto: UpdateReviewDto = new UpdateReviewDto();
    updatedDto.description = 'This is not bad';
    const result = await controller.update(reviewId, updatedDto);
    
    expect(result).toHaveProperty('description', updatedDto.description);
  });

  it('id로 Review 삭제 후 OK 반환', async () => {
    const reviewId: string = 'a1';
    const result = await controller.remove(reviewId);

    expect(result).toBe('OK');
  });
});
