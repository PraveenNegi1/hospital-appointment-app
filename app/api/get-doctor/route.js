// Mock database array (should match the one in create-doctor route)
let doctors = []; // In real apps, use DB

import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ doctors }, { status: 200 });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
