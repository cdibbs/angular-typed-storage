import { InjectionToken, Inject, Injectable } from '@angular/core';
import { TypedStorageKey } from './typed-storage-key';
import { TypedStorageInfo } from './typed-storage-info';
import { ITypedStorageService, ILogService, IConfig } from './i';
import { IMapperService, MapperServiceToken } from 'simple-mapper';

export let TypedStorageToken = new InjectionToken<ITypedStorageService>("ITypedStorageService");
export let TypedStorageConfigToken = new InjectionToken<ITypedStorageService>("IConfig");
export let ViewModelCollection = new InjectionToken("ViewModelCollection");
export let LogService = new InjectionToken<ILogService>("ILogService");

@Injectable()
export class TypedStorageService implements Storage, ITypedStorageService {
    [x: string]: any;
    private reserved: string[] = ["getItem", "setItem", "length", "namespace", "removeItem", "key", "clear", "reserved", "storage", "vms", "mapper", "_config", "formattedKey"];
    private get storage(): Storage { return this._config.storage || localStorage; }
    private get vms(): { [key: string]: any } { return this._config.viewModels || {} }

    constructor(
        @Inject(TypedStorageConfigToken) protected _config: IConfig,
        @Inject(MapperServiceToken) protected mapper: IMapperService)
    {
    }

    public get namespace(): string { return this._config.ns; };

    public getItem<T>(key: TypedStorageKey<T> | string): T {
        if (typeof key === "string" && this.reserved.indexOf(key) >= 0) {
            return this[key];
        }

        let k: string = this.formattedKey(key.toString());
        let json: string = this.storage.getItem(k);
        try {
            let stored: any = JSON.parse(json);            
            let info: TypedStorageInfo<T> = this.mapper.MapJsonToVM(TypedStorageInfo, stored);
            if (! this.vms[info.viewModelName]) {
                return info.viewModel;
            }
            let obj: T = this.mapper.MapJsonToVM<T>(this.vms[info.viewModelName], info.viewModel);
            return obj;
        } catch(err) {
            return null;
        }
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
            info.viewModelName = key.type.prototype.constructor.name;
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
        return key;
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