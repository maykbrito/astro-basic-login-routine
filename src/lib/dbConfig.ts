import mongoose from "mongoose";

//mongo connection
mongoose.connect(import.meta.env.SECRET_MONGO_URL)
const connection = mongoose.connection

connection.on('connected', () => {
  console.log('MongoDB is connected')
})

connection.on('error', (error) => {
  console.log('MongoDB error: ' , error)
})

export default mongoose

