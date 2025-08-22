import { connectDB } from "@/lib/mongoose.js";
import Person from "@/models/Person.js";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const query = q
    ? {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } },
          { city: { $regex: q, $options: "i" } },
          { country: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const people = await Person.find(query);
  return Response.json({ items: people });
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {
    const newPerson = new Person(body);
    await newPerson.save();
    return Response.json(newPerson, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
