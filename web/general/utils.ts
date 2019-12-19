export class Utils {
    public static toDictionary<TItem>(array: TItem[], getKey: (item: TItem) => number): { [id: number]: TItem };
    public static toDictionary<TItem, TValue>(array: TItem[], getKey: (item: TItem) => number, getValue: (item: TItem) => TValue): { [id: number]: TValue };
    public static toDictionary<TItem>(array: TItem[], getKey: (item: TItem) => string): { [id: string]: TItem };
    public static toDictionary<TItem, TValue>(array: TItem[], getKey: (item: TItem) => string, getValue: (item: TItem) => TValue): { [id: string]: TValue };
    public static toDictionary<TItem>(array: TItem[], getKey: (item: TItem) => number | string, getValue?: (item: TItem) => any): any {
        var result = <any>{};
        if (array) {
            if (getValue) {
                array.forEach(_ => result[getKey(_)] = getValue(_));
            }
            else {
                array.forEach(_ => result[getKey(_)] = _);
            }
        }
        return result;
    }
}
