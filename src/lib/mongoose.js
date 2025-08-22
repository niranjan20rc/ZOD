import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("❌ MONGO_URI not found in .env file");

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}










/*
MONGO_URI=mongodb+srv://niranjancse2023:niranjanzod@cluster0.o5clepr.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0

*/