import { connectDB } from "@/lib/mongodb";
import Person from "@/models/Person";

export async function GET(req, { params }) {
  await connectDB();
  const person = await Person.findById(params.id);
  if (!person) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(person);
}

export async function PATCH(req, { params }) {
  await connectDB();
  const body = await req.json();

  try {
    const updated = await Person.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const deleted = await Person.findByIdAndDelete(params.id);
    if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
