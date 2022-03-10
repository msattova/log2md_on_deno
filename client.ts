
import { Convert } from "./convert.ts"

const html = `
<form method="POST" action="/">
  <label for="codearea">
  変換したいログをテキストエディタで開いてCtrl+A, Ctrl+Cしたものを以下にCtrl+V：
  </label>
  <textarea id="codearea" name="code" rows="20", cols="70">
  </textarea>
  <button type="submit">Submit</button>
</form>
`;

export async function handler(req: Request): Promise<Response> {
  switch (req.method) {
    case "GET": {
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    case "POST": {
      const body = await req.formData();
      const htmlcode = body.get("code") || "anonymous";
      const conv = new Convert(htmlcode.toString());
      conv.run();
      return new Response(conv.out_str, {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    default:
      return new Response("Invalid method", { status: 405 });
  }
}
