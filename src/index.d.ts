export declare type MapValue = string | number | boolean;
export declare type FlegObject = {
    [k: string]: MapValue;
};
export declare type FlegArray = [string, MapValue][];
declare let flags: Fleg;
declare global {
    interface Window {
        __fleg: Fleg;
    }
    namespace NodeJS {
        interface Global {
            __fleg: Fleg;
        }
    }
}
export interface Fleg {
    set(key: string, value: MapValue): this;
    set(key: string, value: MapValue, writeCookie: boolean): this;
    set(key: FlegObject): this;
    set(key: FlegArray): this;
    reset(): void;
    [key: string]: any;
}
export declare class Fleg extends Map {
    #private;
    constructor(initialFlags?: FlegObject | FlegArray);
    delete(key: any): boolean;
}
export default flags;
