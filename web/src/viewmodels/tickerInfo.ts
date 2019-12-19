export class TickerInfo {
    private _priceStep: number;
    public get priceStep(): number { return this._priceStep; }
    public set priceStep(v: number) { this._priceStep = v; }

    private _priceStepCost: number;
    public get priceStepCost(): number { return this._priceStepCost; }
    public set priceStepCost(v: number) { this._priceStepCost = v; }

    private _takeMoney: number;
    public get takeMoney(): number { return this._takeMoney; }
    public set takeMoney(v: number) { this._takeMoney = v; }
}