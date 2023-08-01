const { connect } = require('mongoose');

export const connectDB = async () => {
    try {
        await connect('mongodb://localhost/taskdb');        
        console.log('Mongodb connected');
    } catch (ex) {
        console.error(ex);
    }
}

