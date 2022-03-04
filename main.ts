import { DOMParser, Element } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts"

const filepath = "./resource/testlog.html";
const filename = filepath.split('/').reverse()[0].split('.')[0];
const readCode = await Deno.readTextFile(filepath);
const code = readCode.replace(/<br>/g, "\n");

let pchild: Array<Array<string>> = [];

let out_str = `# ${filename}\n\n`

const doc = new DOMParser().parseFromString(code, 'text/html')!;
const p = doc.querySelectorAll("p")!;

for (const e of p){
  let in_list: Array<string> = [];
  let tmp_str = '';
  for (const child of e.childNodes){
    tmp_str = child.textContent.trim();
    in_list.push(tmp_str);
  }
  pchild.push(in_list);
}

let msg_list: Array<Array<string>> = [];

for (const i of pchild){
  let in_list: Array<string> = [];
  i.forEach((e, index) => {
    if (index%2 == 1){
      in_list.push(e);
    }
  });
  msg_list.push(in_list);
}

for (const m of msg_list){
  const tab = m[0];
  const name = m[1];
  const mention = m[2];
  if (mention == ''){
    continue;
  }
  if (name != ''){
    out_str += `${tab} **${name}** : ${mention}\n\n`;
  }else{
    out_str += `${tab} ${name} : ${mention}\n\n`;
  }
}

console.log(out_str);

const write = Deno.writeTextFile("./out.md", out_str);

write.then(() => console.log("File written to ./out.md"));

