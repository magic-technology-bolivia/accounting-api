const { connect } = require('mongoose');

export const connectDB = async () => {
    try {
        await connect('mongodb+srv://smartisatedevelop:S1stemas@cluster0.tdwpyqc.mongodb.net/?retryWrites=true&w=majority');        
        console.log('Mongodb connected');
    } catch (ex) {
        console.error(ex);
    }
}

