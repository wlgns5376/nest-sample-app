import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ReviewDocument = Review & Document;

@Schema()
export class Review {
    @Prop({ required: true })
    product_id: number;

    @Prop()
    name: string;

    @Prop()
    description: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);