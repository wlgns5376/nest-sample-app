import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ReviewDocument = Review & Document;

@Schema({ _id: false })
class Product {
    @Prop()
    id: number;

    @Prop()
    name: string;

    @Prop()
    image_url: string;
}

@Schema()
export class Review {
    @Prop({ type: Product, required: true })
    product: Product

    @Prop()
    name: string;

    @Prop()
    description: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);