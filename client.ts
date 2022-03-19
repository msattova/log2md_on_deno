
import { Convert } from "./convert.ts"

const united_code = async (): Promise<string> => {
  const html = await Deno.readTextFile("./html/client.html");
  const css = await Deno.readTextFile("./style/style.css");
  const destyle = await Deno.readTextFile("./style/destyle.css");
  return html.replace("<link rel=\"stylesheet\" type=\"text/css\" href=\"../style/style.css\" />",
                      `\n<style>\n${css}\n</style>\n`)
              .replace("<link rel=\"stylesheet\" type=\"text/css\" href=\"../style/destyle.css\" />",
                      `\n<style>\n${destyle}\n</style>\n`);
}

export async function handler(req: Request): Promise<Response> {
  const code = (await united_code()).toString();
  switch (req.method) {
    case "GET": {
      return new Response(code, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    case "POST": {
      const body = await req.formData();
      const htmlcode = body.get("confirm") || "anonymous";
      //console.log(htmlcode);
      const conv = new Convert(htmlcode.toString());
      let result: string;
      try{
        conv.run();
        result = conv.out_str;
      } catch(e) {
        console.log(`error occured: ${e}`);
        result = '変換に失敗しました';
      }
      return new Response(code.replace("ここに変換結果が出ます", result), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    default:
      return new Response("Invalid method", { status: 405 });
  }
}
