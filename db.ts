import { connect } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    try {
        //await connect(process.env.MONGO_URI ! );
        await connect("mongodb+srv://magictechnologybolivia:S1stema$12357@cluster0.q3wrovb.mongodb.net/?retryWrites=true&w=majority");
        console.log('Mongodb connected');
    } catch (ex) {
        console.error(ex);
    }
}

