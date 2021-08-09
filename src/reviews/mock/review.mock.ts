import { CreateReviewDto } from "../dto/create-review.dto";
import { Review } from "../schemas/review.schema";

// 테스트하기위한 Mongoose Model의 Mocking model
export const mockCreateDto = (): CreateReviewDto => ({
  product: {
    id: 2,
    name: 'Cafe Latte',
    image_url: null,
  },
  name: 'Tom',
  description: 'This is good.'
});

export const mockReview = (): Review => ({
  product: {
    id: 1,
    name: 'Americano',
    image_url: null,
  },
  name: 'John',
  description: 'This is great.'
});