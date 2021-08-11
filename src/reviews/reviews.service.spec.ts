import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.schema';
import { mockCreateDto, mockReview } from './mock/review.mock';

describe('ReviewsService 테스트', () => {
  let service: ReviewsService;
  let repository: any;

  const mockRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(id => {
      return {}
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getModelToken(Review.name),
          useValue: mockRepository
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return key;
            })
          }
        },
      ]
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    repository = module.get(getModelToken(Review.name));
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('create에 CreateReviewDto가 잘 전달되어야 함', async () => {
    const createSpy = jest.spyOn(repository, 'create');
    const createDto: CreateReviewDto = mockCreateDto();

    await service.create(createDto);

    expect(createSpy).toHaveBeenCalledWith(createDto);
  });

  it('create 성공 후 Review가 반환되어야 함', async () => {
    const mockReturn = mockReview();

    jest.spyOn(repository, 'create')
      .mockResolvedValueOnce(mockReturn);

    const response = await service.create(mockCreateDto());

    expect(response).toEqual(mockReturn);
  });

  it('findAll은 Array가 반환되어야 함', async () => {
    const mockReturn: Review = mockReview();
    jest.spyOn(repository, 'find')
      .mockResolvedValue([mockReturn]);

    const response = await service.findAll();

    expect(response).toBeInstanceOf(Array);
    expect(response).toEqual([mockReturn]);
  });

  it('findOne은 Review가 반환되어야 함', async () => {
    const mockReturn: Review = mockReview();
    jest.spyOn(repository, 'findById')
      .mockResolvedValue(mockReturn);

    const response = await service.findOne('a1');

    expect(response).toEqual(mockReturn);
  });

  it('update시 findByIdAndUpdate로 UpdateReviewDto가 잘 전달되어야 함', async () => {
    const updateDto: UpdateReviewDto = {
      description: mockReview().description
    };
    const updateSpy = jest.spyOn(repository, 'findByIdAndUpdate');

    await service.update('a1', updateDto);

    expect(updateSpy).toHaveBeenCalledWith('a1', updateDto, { new: true });
  });

  it('remove시 findByIdAndRemove로 id가 잘 전달되어야 함', async () => {
    const removeSpy = jest.spyOn(repository, 'findByIdAndRemove');

    await service.remove('a1');

    expect(removeSpy).toHaveBeenCalledWith('a1');
  });

  describe('Update photos', () => {
    const oldPhotos: string[] = [
      'img-a.jpg',
      'img-b.jpg',
      'img-c.jpg',
    ];
    const newPhotos: string[] = [
      'img-a1.jpg',
      'img-b.jpg',
    ];

    it('should return photos for delete', () => {  
      expect(oldPhotos.filter(photo => !newPhotos.includes(photo))).toMatchObject([
        'img-a.jpg',
        'img-c.jpg',
      ]);
    });

    it('should return photos for register', () => {  
      expect(newPhotos.filter(photo => !oldPhotos.includes(photo))).toMatchObject([
        'img-a1.jpg'
      ]);
    });
  });

});