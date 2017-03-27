export class TypedStorageKey<T> {
    constructor(private _key: string) {

    }

    public get key(): string { return this._key; }
}