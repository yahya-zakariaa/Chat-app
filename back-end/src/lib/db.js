import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected" + connect.connection.host);
  } catch (error) {
    console.log("mongo connection error:" + error);
  }
};

export { connectDB };
