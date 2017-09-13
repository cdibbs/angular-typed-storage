import { TypedStorageKey } from './typed-storage-key';
import { TypedStorageInfo } from './typed-storage-info';
import { ITypedStorageService, ILogService, IConfig } from './i';
import { IMapperService, MapperService } from 'simple-mapper';

import { injectable, inject } from 'inversify';
import { TypedStorageConfigToken, MapperServiceToken } from './tokens';

export class TypedStorageService implements Storage, ITypedStorageService {
    [x: string]: any;
    private reserved: string[] = ["models", "getItem", "setItem", "length", "namespace", "removeItem", "key", "clear", "reserved", "storage", "mapper", "_config", "formattedKey", "primitives"];
    private get storage(): Storage {
        if (this._config.storage)
            return this._config.storage;

        if (typeof localStorage !== "undefined")
            return localStorage;
        
        throw new Error("No storage provider configured, and localStorage not defined.");
    }
    private get models(): { [key: string]: any } { return this._config.models || {} }
    private primitives: { [key: string]: Function } = {};

    constructor(
        protected _config: IConfig = {},
        protected mapper: IMapperService = new MapperService())
    {
        this.primitives["Number"] = (i: string) => JSON.parse(i);
        this.primitives["Date"] = (i: string) => new Date(i);
        this.primitives["String"] = (i: string) => i;
        this.primitives["Boolean"] = (i: string) => i;
    }

    public get namespace(): string { return this._config.ns; };

    public getItem<T>(key: TypedStorageKey<T> | string): string | T {
        if (typeof key === "string" && this.reserved.indexOf(key) >= 0) {
            return this[key];
        }

        let k: string = this.formattedKey(key.toString());
        let json: string = this.storage.getItem(k);
        if (! json) { // not found
            return null;
        }

        let stored: any = JSON.parse(json);            
        let info: TypedStorageInfo<T> = this.mapper.map(TypedStorageInfo, stored);
        let type: { new(): T };
        let typedKey: TypedStorageKey<T>;
        let typeName: string;
        if (typeof key !== 'string' && typeof key.type !== 'string') {
            typedKey = key;
            type = typedKey.type;
            typeName = typedKey.typeName;
        } else if (this.models[info.viewModelName]) {
            type = this.models[info.viewModelName];
            typeName = type.name;
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

        let k: string = this.formattedKey(key.toString());
        // createProperty if not reserved word.
        let info = new TypedStorageInfo();
        if (key instanceof TypedStorageKey) {
            info.viewModel = value;
            info.viewModelName = (<{ new(): T }>key.type).prototype.constructor.name;
        } else {
            info.viewModel = value;
            info.viewModelName = null;
        }
        let json: string = JSON.stringify(info); 
        this.storage.setItem(k, json);
    }

    public removeItem<T>(key: TypedStorageKey<T> | string): void {
        if (typeof key === "string" && this.reserved.indexOf(key) >= 0) {
            return;
        }

        let k: string = this.formattedKey(key.toString());
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
        let key: string = this.storage.key(n);
        if (this._config.ns)
            return key ? key.substr(this._config.ns.length + 1) : null;
        return key || null;
    }

    /**
     * Will empty all keys out of storage. TODO: out of this namespace? does an app have multiple?
     */
    public clear(): void {
        this.storage.clear();
    }

    private formattedKey(key: string): string {
        if (! this._config.ns) return key;
        return this._config.ns + "." + key.toString();
    }
}