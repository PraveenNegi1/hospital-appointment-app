import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { id, updateData } = await req.json();
    await adminDb.collection("doctors").doc(id).update(updateData);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
