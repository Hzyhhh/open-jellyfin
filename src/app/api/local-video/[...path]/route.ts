import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { NextRequest } from "next/server";
import { getLocalVideoAbsolutePath } from "@/lib/local-library";

function getContentType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case ".mp4":
    case ".m4v":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".mov":
      return "video/quicktime";
    case ".mkv":
      return "video/x-matroska";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  const relativePath = segments.map(decodeURIComponent).join("/");
  const absolutePath = getLocalVideoAbsolutePath(relativePath);
  const fileStats = await stat(absolutePath);
  const rangeHeader = request.headers.get("range");
  const contentType = getContentType(absolutePath);

  if (!rangeHeader) {
    const stream = createReadStream(absolutePath);

    return new Response(stream as unknown as BodyInit, {
      status: 200,
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Length": fileStats.size.toString(),
        "Content-Type": contentType,
      },
    });
  }

  const [startText, endText] = rangeHeader.replace("bytes=", "").split("-");
  const start = Number(startText);
  const end = endText ? Number(endText) : fileStats.size - 1;
  const chunkSize = end - start + 1;
  const stream = createReadStream(absolutePath, { start, end });

  return new Response(stream as unknown as BodyInit, {
    status: 206,
    headers: {
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize.toString(),
      "Content-Range": `bytes ${start}-${end}/${fileStats.size}`,
      "Content-Type": contentType,
    },
  });
}
