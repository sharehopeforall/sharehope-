import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/server/admin-auth";

// Admin-only endpoint: issues a token for direct-to-Vercel-Blob uploads,
// then notifies once the upload completes so metadata can be persisted
// via the Spring Boot API.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  // Token requests come from the admin browser and require its JWT. Completion
  // callbacks come from Vercel Blob and are signature-verified by handleUpload.
  if (body.type === "blob.generate-client-token" && !(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const metadata = JSON.parse(clientPayload ?? "{}") as { contentType?: string; size?: number };
        const isVideo = metadata.contentType?.startsWith("video/") ?? false;
        const maximumSizeInBytes = isVideo ? 250 * 1024 * 1024 : 10 * 1024 * 1024;
        if (typeof metadata.size !== "number" || metadata.size > maximumSizeInBytes) {
          throw new Error(isVideo ? "Video must be smaller than 250 MB." : "Image must be smaller than 10 MB.");
        }
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "video/mp4",
            "video/webm",
            "video/quicktime",
          ],
          maximumSizeInBytes,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ pathname }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.info("Blob upload completed:", blob.pathname);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
