import mongoose from 'mongoose';
import config from '../common/config';

export const connectMongoDB = async () => {
    const MONGO_URL = config.mongodb.uri;

    
    try {
        await mongoose.connect(MONGO_URL || '');

        console.log('Connect Mongo Success');
    }catch (error) {
        console.log(error);
    }

}