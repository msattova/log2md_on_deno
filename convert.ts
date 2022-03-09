import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts"


export class Convert{

    private filename = "";
    public out_str = "";

    //constructor(public readonly filepath:string) {}
    constructor(public readonly inputcode:string){}

    private setup = /*async*/ (): string => {
      //this.filename = this.filepath.split('/').reverse()[0].split('.')[0];
      //const readCode = await Deno.readTextFile(this.filepath);
      return this.inputcode.replace(/<br>/g, "\n");
    };
    private parseLog = (code: string) => {
        const p_child: Array<Array<string>> = [];
        this.out_str += `# （タイトル）\n\n`
        const doc = new DOMParser().parseFromString(code.toString(), 'text/html')!;
        const p_all = doc.querySelectorAll("p")!;
        for (const e of p_all){
            const in_list: Array<string> = [];
            let tmp_str = '';
            for (const child of e.childNodes){
                tmp_str = child.textContent.trim();
                in_list.push(tmp_str);
            }
            p_child.push(in_list);
        }
        return p_child;
    };
    private make_msglist = (p_child: Array<Array<string>>) => {
        const msg_list: Array<Array<string>> = [];
        for (const i of p_child) {
          const in_list: Array<string> = [];
          i.forEach((e, index) => {
           if (index % 2 == 1) {
              in_list.push(e);
            }
          });
          msg_list.push(in_list);
        }
        return msg_list;
    };
    private make_out_str = (msg_list: Array<Array<string>>) => {
        for (const m of msg_list){
            const tab = m[0];
            const name = m[1];
            const mention = m[2];
            if (mention == ''){
                continue;
            }
            if (name != ''){
                this.out_str += `${tab} **${name}** : ${mention}\n\n`;
            } else {
                this.out_str += `${tab} ${name} : ${mention}\n\n`
            }
        }
    };
    private write_str = () => {
        console.log(this.out_str);
        const write = Deno.writeTextFile("./out.md", this.out_str);
        write.then(() => console.log("File written to ./out.md"));
    };

    public run(){
        const code = this.setup();
        //console.log(code);
        const p_child = this.parseLog(code);
        //console.log(p_child);
        const msg_list = this.make_msglist(p_child);
        //console.log(msg_list);
        this.make_out_str(msg_list);
        this.write_str();
    }
}



