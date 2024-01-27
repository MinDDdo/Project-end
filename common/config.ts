import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export default  {
    mongodb: {
        uri: process.env.MONGO_URI,
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD
    },
    jwt: {
        secret_key: process.env.SECRET_KEY
    }
}