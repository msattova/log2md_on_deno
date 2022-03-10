
export class Convert {

    public out_str = "";

    constructor(public readonly inputcode: string) { }

    private catch_p = (code: string): Array<Array<string>> => {
        return code.trim().replace(/\r?\n/g, "")
            .match(new RegExp("<p(?: .+?)?>.*?<\/p>", "g"))!
            .map(p_child => p_child.match(new RegExp("<span>.*?<\/span>", "g")))
            .filter((item): item is NonNullable<typeof item> => item != null)
            .map(in_span => in_span.map(s => s.replace(/<\/?span>/g, ""))
                .map(e => e.trim()));
    };

    private setup = (code: string): Array<Array<string>> => {
        console.log("setup");
        return this.catch_p(code)
            .map(s => s.map(e => e.replace(/<br>/g, "\n")));
    };

    private make_out_str = (msg_list: Array<Array<string>>) => {
        let out = "# (タイトル)\n\n"
        for (const m of msg_list) {
            const tab = m[0];
            const name = m[1].replace(/\*/g, "\\*");
            const mention = m[2].replace(/\*/g, "\\*");
            if (mention == '') {
                continue;
            }
            if (name != '') {
                out += `${tab} **${name}** : ${mention}\n\n`;
            } else {
                out += `${tab} ${name} : ${mention}\n\n`
            }
        }
        return out.replace(/&gt;/g, ">")
            .replace(/&lt;/g, "<");
    };

    public run() {
        const code = this.setup(this.inputcode);
        this.out_str = this.make_out_str(code);
        //console.log(this.out_str);
    }
}
