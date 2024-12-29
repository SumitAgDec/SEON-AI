import mongoose from "mongoose";

async function connectDB(url) {
    await mongoose.connect(url)
        .then(() => {
            console.log('mongodb connected !')
        })
        .catch((err) => {
            console.log('Error !', err)
        })
}

export default connectDB