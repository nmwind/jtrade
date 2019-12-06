export class TickerClass {
    public id: number;
    public title: string;

    public static get Stock(): number { return 1; }
    public static get Futures(): number { return 2; }
    public static get Currency(): number { return 3; }
}
