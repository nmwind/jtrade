export class TickerType {
    public id: number;
    public title: string;

    public static get Stock(): number { return 1; }
    public static get Commodity(): number { return 2; }
    public static get Currency(): number { return 3; }
}
