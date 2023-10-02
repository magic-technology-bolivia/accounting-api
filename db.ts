import { connect } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI ! );
        console.log('Mongodb connected');
    } catch (ex) {
        console.error(ex);
    }
}

