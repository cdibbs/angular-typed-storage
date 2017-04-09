import { ILogService } from './i-log.service';

export interface IConfig {
    /** Deprecated. This defaults to console. Please use TypedStorageLoggerToken in your providers, instead. */
    logger?: ILogService;

    /** The namespace to use, i.e., com.example.myapp. Default: null = do not use namespace. */
    ns?: string;

    /** The dictionary of view models to use for recursive mapping, if any. Default: empty.*/
    viewModels?: { [key: string]: any };

    /**
     * Whether or not to use Proxy to facilitate indexer access to typed storage, i.e., typedStorage[myprop] == typedStorage.getItem(myprop).
     * Proxy does not exist in some older browsers like Internet Explorer.
     */
    noProxy?: boolean;

    /** Underlying storage: either localStorage or sessionStorage. Default: localStorage. */
    storage?: Storage;
}