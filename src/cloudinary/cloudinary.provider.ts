import { v2 } from 'cloudinary';
import { CLOUDINARY } from '@/data/defaultData';

export const CloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: () => {
        return v2.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API,
            api_secret: process.env.CLOUDINARY_SECRET,
        });
    },
};
