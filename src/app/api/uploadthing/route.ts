import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// UploadThing route handler (A3). Reads UPLOADTHING_TOKEN from the environment.
export const { GET, POST } = createRouteHandler({ router: ourFileRouter });
