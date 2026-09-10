import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const f = createUploadthing();

/**
 * Document uploads for the Smart Document Checklist (A3). One file per checklist
 * item (PDF or image, ≤4 MB). Ownership is enforced in the middleware BEFORE the
 * upload is authorized — a user can only attach to a checklist item that belongs
 * to their own application, so there is no IDOR. On completion the item records
 * the file and advances to PREPARED; any previous file is deleted from storage.
 */
export const ourFileRouter = {
  documentUploader: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .input(z.object({ itemId: z.string().min(1) }))
    .middleware(async ({ input }) => {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) throw new UploadThingError("Not authenticated");

      const item = await db.documentChecklistItem.findUnique({
        where: { id: input.itemId },
        select: {
          id: true,
          fileKey: true,
          application: { select: { userId: true } },
        },
      });
      if (!item || item.application.userId !== userId) {
        throw new UploadThingError("Not authorized");
      }

      // Passed to onUploadComplete (runs on our server, called by UploadThing).
      return { userId, itemId: item.id, prevFileKey: item.fileKey };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Replace any prior file for this item so storage doesn't accumulate.
      if (metadata.prevFileKey) {
        try {
          await new UTApi().deleteFiles(metadata.prevFileKey);
        } catch {
          // Non-fatal: the new file is still recorded below.
        }
      }
      await db.documentChecklistItem.update({
        where: { id: metadata.itemId },
        data: {
          fileUrl: file.ufsUrl,
          fileName: file.name,
          fileKey: file.key,
          status: "PREPARED",
        },
      });
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
