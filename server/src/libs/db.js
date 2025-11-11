import mongoose from "mongoose"

export const connectDB = async ()=>{
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    // if error occuring refer the other parent project how did you did it when hitesh sir taught
    console.log(`\nMongoDB Connection Successful : ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB Connection Failed. (db.js)`)
    throw error
    process.exit(1); // 1 means failure
  }
}