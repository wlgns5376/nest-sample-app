import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewDocument, Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Model } from 'mongoose';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const createdReview = new this.reviewModel(createReviewDto);
    return createdReview.save();
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find().exec();
  }

  async findOne(id: any): Promise<Review> {
    return this.reviewModel.findById(id).exec();
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    return this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Review> {
    return this.reviewModel.findByIdAndRemove(id).exec();
  }
}
