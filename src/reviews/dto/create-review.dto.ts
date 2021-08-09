import { Type } from "class-transformer";
import { IsNotEmpty, Length, ValidateNested } from "class-validator";

class Product {

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    name: string;

    image_url: string
}

export class CreateReviewDto {

    @ValidateNested()
    @Type(() => Product)
    product: Product;

    @Length(2, 100)
    name: string;

    description: string;
}
