import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Typed client helpers for the document uploader (A3). Using the hook (rather
// than the prebuilt <UploadButton>) lets us render a control styled to match the
// app and avoid importing UploadThing's stylesheet.
export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
