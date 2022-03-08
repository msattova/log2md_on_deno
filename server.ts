import { serve } from "https://deno.land/std@0.114.0/http/server.ts"

import { handler } from "./client.ts"


console.log("Listening on http://localhost:8000");
serve(handler);

