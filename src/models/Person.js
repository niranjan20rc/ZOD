import mongoose from "mongoose";

const PersonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    city: { type: String },
    country: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Person || mongoose.model("Person", PersonSchema);
