// app/api/create-doctor/route.js
import { NextResponse } from "next/server";

let doctors = []; // same as get-doctors

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, specialty, experience, bio, fee } = body;

    if (!name || !email || !specialty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newDoctor = {
      id: Date.now().toString(),
      name,
      email,
      password,
      specialty,
      experience,
      bio,
      fee,
      approved: false,
    };

    doctors.push(newDoctor);

    return NextResponse.json({ doctor: newDoctor }, { status: 201 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
