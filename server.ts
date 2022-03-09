import { serve } from "https://deno.land/std@0.114.0/http/server.ts"

import { handler } from "./client.ts"

const addr = ":8000";
console.log(`Listening on http://localhost${addr}`);
serve(handler, { addr });
