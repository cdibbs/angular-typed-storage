import { ILogService } from './i-log.service';

export interface IConfig {
    /** This defaults to console. */
    logger?: ILogService;

    /** The namespace to use, i.e., com.example.myapp */
    ns?: string;

    /** The dictionary of view models to use for recursive mapping. */
    viewModels?: { [key: string]: any };

    /**
     * Whether or not to use Proxy to facilitate indexer access to typed storage, i.e., typedStorage[myprop] == typedStorage.getItem(myprop).
     * Proxy does not exist in some older browsers like Internet Explorer.
     */
    noProxy?: boolean;

    /** Underlying storage: either localStorage or sessionStorage. */
    storage?: Storage;
}