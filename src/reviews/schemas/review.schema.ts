import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
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

@Schema({
    toJSON: {
        virtuals: true,
        transform: (doc, { _v, ...rest }) => rest
    }
})
export class Review {
    @Prop({ type: Product, required: true })
    product: Product

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    photos: string[];

}

export const ReviewSchema = SchemaFactory.createForClass(Review);

/**
 * Main photo url plugin
 * 
 * @param schema any Mongoose schema
 * @param options any 
 */
export const mainPhotoUrlPlugin = (schema: any, options: any) => {
    schema.virtual('mainPhotoUrl').get(function() {
        if (this.photos.length == 0) {
            return null;
        }

        if (options.photoPath) {
        return `${options.photoPath}/${this.photos[0]}`;
        }

        return this.photos[0];
    });
}