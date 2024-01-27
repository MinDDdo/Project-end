import mongoose from 'mongoose';
import config from '../common/config';

export const connectMongoDB = async () => {
    let MONGO_URL = config.mongodb.uri;
    MONGO_URL = MONGO_URL?.replace("USERNAME", config.mongodb.username || "")
    MONGO_URL = MONGO_URL?.replace("PASSWORD", config.mongodb.password || "")
    console.log(MONGO_URL)
    
    try {
        await mongoose.connect(MONGO_URL || '');

        console.log('Connect Mongo Success');
    }catch (error) {
        console.log(error);
    }

}