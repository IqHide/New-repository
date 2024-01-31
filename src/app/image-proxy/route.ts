import { NextRequest, NextResponse } from "next/server";

// SSRF protection: block private/internal IP ranges and hostnames
const BLOCKED_HOSTNAMES = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];
const PRIVATE_IP_REGEX =
  /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|169\.254\.|127\.|::1|fc00:|fe80:)/;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) return NextResponse.json({ error: "No URL" }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (parsed.protocol !== "https:") {
    return NextResponse.json({ error: "HTTPS only" }, { status: 400 });
  }

  const hostname = parsed.hostname;
  if (
    BLOCKED_HOSTNAMES.includes(hostname) ||
    PRIVATE_IP_REGEX.test(hostname)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error("[image-proxy] fetch failed:", response.status, response.statusText);
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.startsWith("image/")) {
      console.error("[image-proxy] not an image, content-type:", contentType);
      return NextResponse.json({ error: "Not an image" }, { status: 400 });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }
}