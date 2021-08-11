import { join } from "path";

export default () => ({
    uploadPath: join(process.env.STATIC_PATH, 'upload'),
    review: {
        photoPath: join(process.env.STATIC_PATH, 'reviews'),
    },
});