import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Basic safety check (optional but recommended)
  if (!url.startsWith("https://audio-ssl.itunes.apple.com")) {
    return new NextResponse("Invalid audio source", { status: 403 });
  }

  const range = req.headers.get("range") ?? undefined;

  const upstreamResponse = await fetch(url, {
    headers: range ? { range } : undefined,
  });

  if (!upstreamResponse.ok) {
    return new NextResponse("Failed to fetch audio", {
      status: upstreamResponse.status,
    });
  }

  const headers = new Headers(upstreamResponse.headers);

  // 🔓 Enable Web Audio access
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Headers", "Range");
  headers.set("Access-Control-Expose-Headers", "Content-Range, Accept-Ranges");

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers,
  });
}
