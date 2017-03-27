import { TypedStorageKey } from './typed-storage-key';

export class TypedStorage implements Storage {
    [x: string]: any;
    reserved: string[] = ["getItem", "setItem", "length", "namespace", "removeItem", "key", "clear"];

    constructor(
        protected _namespace: string,
        protected _underlyingStorage: Storage,

    ) {

    }

    public get namespace(): string { return this._namespace; };

    public getItem<T>(key: TypedStorageKey<T> | string): T {
        return <T>{};
    }

    public setItem<T>(key: TypedStorageKey<T> | string, value: T): void {
        // createProperty if not reserved word.
    }

    public removeItem<T>(key: TypedStorageKey<T> | string): void {

    }

    public get length(): number {
        return 0;
    }

    /**
     * Returns the name of the nth key in storage.
     * @param n The index of the key.
     */
    public key(n: number): string {
        return "";
    }

    /**
     * Will empty all keys out of storage. TODO: out of this namespace? does an app have multiple?
     */
    public clear(): void {

    }
}