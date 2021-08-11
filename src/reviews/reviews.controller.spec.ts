import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { mockCreateDto, mockReview } from './mock/review.mock';

describe('ReviewsController 테스트', () => {
  let controller: ReviewsController;
  let service: ReviewsService;
  
  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }    

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: mockService,
        }
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be service created', async () => {
    const createSpy = jest.spyOn(service, 'create');

    const mockDto: CreateReviewDto = mockCreateDto();
    await controller.create(mockDto);

    expect(createSpy).toHaveBeenCalledWith(mockDto);
  });

  it('create 성공 후 Review 반환되어야 함', async () => {
    const mockReturn = mockReview();
    jest.spyOn(service, 'create').mockResolvedValue(mockReturn);

    const response = await controller.create(mockCreateDto());

    expect(response).toEqual(mockReturn);
  });

  it('findAll는 Review[]로 반환되어야 함', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([
      mockReview()
    ]);
    const response = await controller.findAll();

    expect(response).toBeInstanceOf(Array);
  });

  it('findOne에 결과는 Review로 반환되어야 함', async () => {
    const mockReturn = mockReview();
    jest.spyOn(service, 'findOne')
      .mockResolvedValue(mockReturn);

    const response = await controller.findOne('a1');

    expect(response).toEqual(mockReturn);
  });

  it('findOne에 결과가 없으면 NotFound가 반환되어야 함', async () => {
    jest.spyOn(service, 'findOne')
      .mockRejectedValueOnce(new Error());

    await expect(controller.findOne('a2')).rejects.toThrow(new NotFoundException());
  });

  it('service에 updateDto가 잘 전달되어야 함', async () => {
    const updateSpy = jest.spyOn(service, 'update');
    const updateDto: UpdateReviewDto = new UpdateReviewDto();
    updateDto.description = 'This is not bad.';

    await controller.update('a1', updateDto);

    expect(updateSpy).toHaveBeenCalledWith('a1', updateDto);
  });

  it('존재하지 않는 Review id면 NotFound가 반환되어야 함', async () => {
    jest.spyOn(service, 'update')
      .mockRejectedValueOnce(new Error());

    const updateDto: UpdateReviewDto = new UpdateReviewDto();
    updateDto.description = 'This is not bad.';

    await expect(controller.update('a2', updateDto)).rejects.toThrow(new NotFoundException());
  });

  it('remove 성공 후 OK가 반환되어야 함', async () => {
    jest.spyOn(service, 'remove')
      .mockResolvedValue(mockReview());
    
    const response = await controller.remove('a1');

    expect(response).toBe("OK");
  });

  it('service remove 결과가 null이면 NotFound를 반환되어야 함', async () => {
    jest.spyOn(service, 'remove')
      .mockResolvedValue(null);
    
    await expect(controller.remove('a1')).rejects.toThrow(new NotFoundException());
  });
});
