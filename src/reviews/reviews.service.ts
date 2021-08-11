import { join } from 'path';
import { existsSync, mkdirSync, renameSync, unlinkSync } from 'fs';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { ReviewDocument, Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private configService: ConfigService
  ) {
  }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    createReviewDto.photos.forEach(photo => this.savePhoto(photo));

    return await this.reviewModel.create(createReviewDto);
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewModel.find();
  }

  async findOne(id: any): Promise<Review> {
    return await this.reviewModel.findById(id);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    if (updateReviewDto.photos) {
      const review = await this.reviewModel.findById(id);
      // 기존 photos와 새로운 photos를 비교
      review.photos.forEach(photo => {
        // 새로운 photos에 속하지 않은 기존 photos는 파일삭제
        if (!updateReviewDto.photos.includes(photo)) {
          this.deletePhoto(photo);
        }
      })
      // 기존 photos에 속하지 않은 새로운 photos는 파일이동
      updateReviewDto.photos.forEach(photo => {
        if (!review.photos.includes(photo)) {
          this.savePhoto(photo);
        }
      })
    }

    return await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true });
  }

  async remove(id: string): Promise<Review> {
    const review = await this.reviewModel.findByIdAndRemove(id);

    // 이미지 삭제 후 파일 삭제..
    if (review.photos?.length > 0) {
      review.photos.forEach(photo => this.deletePhoto(photo))
    }

    return review;
  }

  private savePhoto(photo: string) {
    const basePath = process.cwd();
    const photoPath = join(basePath, this.configService.get<string>('review.photoPath'));
    const path = join(basePath, this.configService.get<string>('uploadPath'), photo);

    if (existsSync(path)) {
      mkdirSync(photoPath, { recursive: true });
      renameSync(path, join(photoPath, photo));
    }
  }

  private deletePhoto(photo: string) {
    const path = join(
      process.cwd(),
      this.configService.get<string>('review.photoPath'),
      photo
    );

    existsSync(path) && unlinkSync(path);
  }
}
