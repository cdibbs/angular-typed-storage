import { ILogService } from './i-log.service';

export interface IConfig {
    /** This defaults to console. */
    logger?: ILogService;

    /** The dictionary of view models to use for recursive mapping. */
    viewModels: { [key: string]: any };
}