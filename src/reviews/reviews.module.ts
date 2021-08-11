import { extname } from 'path';

import { BadRequestException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';

import { diskStorage } from 'multer';
import { v4 } from 'uuid';

import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review, ReviewSchema, mainPhotoUrlPlugin } from './schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: Review.name,
      // imports: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const schema = ReviewSchema;
        schema.plugin(mainPhotoUrlPlugin, {
          photoPath: configService.get<string>('review.photoPath')
        });
      
        return schema;
      },
      inject: [ConfigService],
    }]),
    MulterModule.registerAsync({
      // imports: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        fileFilter: (req, file, callback) => {
          if (!file.originalname.match(/\.(gif|png|jpe?g)$/)) {
            return callback(new BadRequestException("Only image files are allowed!"), false);
          }
    
          callback(null, true);
        },
        storage: diskStorage({
          destination: configService.get<string>('uploadPath'),
          filename: (req, file, callback) => {
            callback(null, `${v4()}${extname(file.originalname)}`);
          }
        })
      }),
      inject: [ConfigService],
    }),
    ConfigService,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
