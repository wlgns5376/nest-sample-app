import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewDocument, Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    return await this.reviewModel.create(createReviewDto);
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewModel.find();
  }

  async findOne(id: any): Promise<Review> {
    return await this.reviewModel.findById(id);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    return await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true });
  }

  async remove(id: string): Promise<Review> {
    return await this.reviewModel.findByIdAndRemove(id);
  }
}
