import { MapperService } from "simple-mapper";

import { TypedStorageService } from "./typed-storage.service";
import { TypedStorageInfo } from "./typed-storage-info";
import { IConfig, ILogService, ITypedStorageService, IMapper } from "./i";

export function typedStorageFactory(
    config: IConfig = {},
    mapper: IMapper = null,
    proxyClass?: typeof Proxy
): ITypedStorageService {
    if (proxyClass === undefined && typeof Proxy !== "undefined") {
        proxyClass = Proxy;
    }

    if (mapper === null) {
        mapper = new MapperService();
    }

    const log: ILogService = (config && config.logger) || console;
    if (typeof proxyClass === "function" && ! config.noProxy) {
        const handler: ProxyHandler<TypedStorageService> = {
            set(target, prop, value, receiver) {
                target.setItem(prop.toString(), value);
                return true;
            },
            get(target, prop, receiver) {
                const v: any = prop.valueOf();
                if (typeof v !== "string" && !(v instanceof TypedStorageInfo)) {
                    return target[prop];
                }
                return target.getItem(prop.toString());
            },
            deleteProperty(target, prop): boolean {
                target.removeItem(prop.toString());
                return true;
            }
        };
        // TypedStorageService.prototype = <TypedStorageService>new Proxy({}, handler);
        return new proxyClass(new TypedStorageService(config, mapper), handler);
    } else if (! config.noProxy) {
        // Proxy class is only available in reasonably modern browsers.
        log.warn(
            "TypedStorage: Proxy doesn't seem available (are you using IE?). Be sure to use getItem"
            + "and setItem instead of indexer typedStorage[prop]. Set config.noProxy to clear this message.");
    }
    return new TypedStorageService(config, mapper);
}
