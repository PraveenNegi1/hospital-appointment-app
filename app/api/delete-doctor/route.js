import { adminDb, adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { id } = await req.json();

    // Delete from Firestore
    await adminDb.collection("doctors").doc(id).delete();
    await adminDb.collection("users").doc(id).delete();

    // Delete from Firebase Auth
    await adminAuth.deleteUser(id);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
