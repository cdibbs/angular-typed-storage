import { TypedStorageKey } from "./typed-storage-key";
import { TypedStorageInfo } from "./typed-storage-info";
import { ITypedStorageService, ILogService, IConfig, IMapper, IPrimitives } from "./i";
import { MapperService } from "simple-mapper";
import { injectable, inject } from "inversify";

export class TypedStorageService implements Storage, ITypedStorageService {
    [x: string]: any;
    private defaultStorage: Storage;
    private reserved: Array<string> = [
        "models", "getItem", "setItem", "length", "namespace", "removeItem", "key", "clear",
        "reserved", "storage", "mapper", "_config", "formattedKey", "primitives", "defaultStorage"];
    private get storage(): Storage {
        if (this._config.storage) {
            return this._config.storage;
        }

        if (typeof localStorage !== "undefined") {
            return localStorage;
        }

        throw new Error("No storage provider configured, and localStorage not defined.");
    }

    private primitives: IPrimitives = {} as IPrimitives;

    constructor(
        protected _config: IConfig = {},
        protected mapper: IMapper = new MapperService()
    ) {
        this.primitives.Number = (i: string) => JSON.parse(i);
        this.primitives.Date = (i: string) => new Date(i);
        this.primitives.String = (i: string) => i;
        this.primitives.Boolean = (i: boolean) => i;
    }

    public get namespace(): string { return this._config.ns; }

    public getItem<T>(key: TypedStorageKey<T> | string): string | T {
        if (typeof key === "string" && this.reserved.indexOf(key) >= 0) {
            return this[key];
        }

        const k: string = this.formattedKey(key.toString());
        const json: string = this.storage.getItem(k);
        if (! json) { // not found
            return null;
        }

        const stored: any = JSON.parse(json);
        const info: TypedStorageInfo<T> = this.mapper.map(TypedStorageInfo, stored);
        let type: { new(): T };
        let typedKey: TypedStorageKey<T>;
        let typeName: string;
        if (typeof key !== "string" && typeof key.type !== "string") {
            typedKey = key;
            type = typedKey.type;
            typeName = typedKey.typeName;
        } else {
            return info.viewModel;
        }

        let obj: T;
        if (! this.primitives[typeName]) {
            obj = this.mapper.map<T>(type, info.viewModel);
        } else {
            obj = this.primitives[type.name](info.viewModel);
        }
        return obj;
    }

    public setItem<T>(key: TypedStorageKey<T> | string, value: T): void {
        if (typeof key === "string" && this.reserved.indexOf(key) >= 0) {
            return;
        }

        const k: string = this.formattedKey(key.toString());
        // createProperty if not reserved word.
        const info = new TypedStorageInfo();
        if (key instanceof TypedStorageKey) {
            info.viewModel = value;
            info.viewModelName = (key.type as { new(): T }).prototype.constructor.name;
        } else {
            info.viewModel = value;
            info.viewModelName = null;
        }
        const json: string = JSON.stringify(info);
        this.storage.setItem(k, json);
    }

    public removeItem<T>(key: TypedStorageKey<T> | string): void {
        if (typeof key === "string" && this.reserved.indexOf(key) >= 0) {
            return;
        }

        const k: string = this.formattedKey(key.toString());
        this.storage.removeItem(k.toString());
    }

    public get length(): number {
        return this.storage.length;
    }

    /**
     * Returns the name of the nth key in storage.
     * @param n The index of the key.
     */
    public key(n: number): string {
        const key: string = this.storage.key(n);
        if (this._config.ns) {
            return key ? key.substr(this._config.ns.length + 1) : null;
        }
        return key || null;
    }

    /**
     * Will empty all keys out of storage. TODO: out of this namespace? does an app have multiple?
     */
    public clear(): void {
        this.storage.clear();
    }

    private formattedKey(key: string): string {
        if (! this._config.ns) {
            return key;
        }

        return this._config.ns + "." + key.toString();
    }
}
