import { NextRequest } from "next/server";
import { jellyfinConfig } from "@/lib/config";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const { baseUrl, apiKey } = jellyfinConfig;

  if (!baseUrl || !apiKey) {
    return new Response("Missing Jellyfin configuration.", { status: 500 });
  }

  const upstreamUrl = new URL(
    `${baseUrl}/Videos/${id}/stream?static=true&api_key=${apiKey}`,
  );

  const range = request.headers.get("range");
  const upstream = await fetch(upstreamUrl, {
    headers: range ? { Range: range } : undefined,
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response(upstream.body, {
      status: upstream.status,
      headers: filterHeaders(upstream.headers),
    });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: filterHeaders(upstream.headers),
  });
}

function filterHeaders(headers: Headers) {
  const forwarded = new Headers();
  const allowList = [
    "accept-ranges",
    "content-length",
    "content-range",
    "content-type",
    "etag",
    "last-modified",
  ];

  for (const name of allowList) {
    const value = headers.get(name);

    if (value) {
      forwarded.set(name, value);
    }
  }

  return forwarded;
}
