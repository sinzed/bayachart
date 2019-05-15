class Color {
    public value : string;
    h: number;
    s : string;
    l: string;
    constructor(h : number, s:string,l:string){
        this.value = "hsla("+h+",100%,40%,1)";
        this.h = h;
        this.s = s;
        this.l = l;
    }
}