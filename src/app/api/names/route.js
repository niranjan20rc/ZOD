import mongoose, { Schema, models, model } from "mongoose";

const MONGO_URI = process.env.MONGO_URI || `mongodb+srv://niranjancse2023:niranjanzod@cluster0.o5clepr.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0`

// ✅ DB Connection Helper
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

// ✅ Schema + Model
const nameSchema = new Schema({
  name: { type: String, required: true },
});

const Name = models.Name || model("Name", nameSchema);

// ✅ POST → Add a name
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    const newName = new Name({ name });
    await newName.save();

    return new Response(JSON.stringify({ message: "Name added successfully" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// ✅ GET → Fetch all names
export async function GET() {
  try {
    await connectDB();
    const names = await Name.find({}).lean();
    return new Response(JSON.stringify(names || []), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify([]), { status: 200 }); // always return an array
  }
}
