// app/api/movies/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "movie.json");

  try {
    // Read the file content
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Parse the file content into JSON
    const movies = JSON.parse(fileContent);

    // Return the data as JSON response
    return NextResponse.json(movies);
  } catch (error) {
    // If there's any error (like file read failure), return an error response
    return NextResponse.json(
      { error: "Error reading the file", details: error.message },
      { status: 500 }
    );
  }
}
