import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ReviewDocument = Review & Document;

@Schema()
export class Review {
    @Prop({ required: true })
    product_id: Number;

    @Prop()
    name: String;

    @Prop()
    description: String;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);