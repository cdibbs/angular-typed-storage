import { IMapperService } from 'simple-mapper';

import { TypedStorageService } from './typed-storage.service';
import { TypedStorageInfo } from './typed-storage-info';
import { IConfig, ILogService, ITypedStorageService } from './i';

export function typedStorageFactory(config: IConfig = {}, mapper: IMapperService): ITypedStorageService {
    let log: ILogService = (config && config.logger) || console;
    if (typeof Proxy !== "undefined" || ! config.noProxy) {
        let handler: ProxyHandler<TypedStorageService> = {
            set: function(target, prop, value, receiver) {
                target.setItem(prop.toString(), value);
                return true;
            },
            get: function(target, prop, receiver) {
                if (typeof prop.valueOf() !== "string" && !(prop.valueOf() instanceof TypedStorageInfo)) {
                    return target[prop];
                }
                return target.getItem(prop.toString());
            },
            deleteProperty: function(target, prop): boolean {
                target.removeItem(prop.toString());
                return true;
            }
        };
        //TypedStorageService.prototype = <TypedStorageService>new Proxy({}, handler);
        return new Proxy(new TypedStorageService(config, mapper), handler);
    } else if (typeof Proxy === "undefined") {
        // Proxy class is only available in reasonably modern browsers.
        log.warn("TypedStorage: Proxy doesn't seem available (are you using IE?). Be sure to use getItem, setItem instead of indexer typedStorage[prop]. Set config.noProxy to clear this message.");
    }
    let tss = new TypedStorageService(config, mapper);
    return tss;
}