class Color {
    public value : string;
    h: number;
    s : number;
    l: number;
    a: number;
    constructor(h : number, s:number,l:number, a=1){
        this.value = "hsla("+h+","+s+"%,"+l+"%,"+a+")";
        this.h = h;
        this.s = s;
        this.l = l;
    }
}