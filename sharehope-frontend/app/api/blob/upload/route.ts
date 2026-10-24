import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/server/admin-auth";

// Admin-only endpoint: issues a token for direct-to-Vercel-Blob uploads,
// then notifies once the upload completes so metadata can be persisted
// via the Spring Boot API.
export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "application/pdf",
          ],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ pathname }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // TODO: call the Spring Boot API to persist blob.url + metadata
        // (pathname, contentType, uploadedAt, uploadedBy) in PostgreSQL.
        console.log("Blob upload completed:", blob.url);
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
