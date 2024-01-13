import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export default  {
    mongodb: {
        uri: process.env.MONGO_URI
    },
    jwt: {
        secret_key: process.env.SECRET_KEY
    }
}