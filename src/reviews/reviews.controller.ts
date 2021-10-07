import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  UploadedFiles 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FilesUploadDto } from './dto/fileupload.dto';
import { Review } from './schemas/review.schema';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  async findAll(): Promise<Review[]> {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Review> {
    try {
      return await this.reviewsService.findOne(id);
    } catch (err) {
      throw new NotFoundException();
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto): Promise<Review> {
    try {
      return await this.reviewsService.update(id, updateReviewDto);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<String> {
    try {      
      const result = await this.reviewsService.remove(id);
      if (result === null) {
        throw new NotFoundException();
      }

      return 'OK';
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 5))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FilesUploadDto,
  })
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map(file => ({
      filename: file.filename,
      path: file.path,
    }))
  }
}
