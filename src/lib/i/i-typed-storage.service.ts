import { TypedStorageKey } from '../typed-storage-key';

export interface ITypedStorageService extends Storage {

    /** The namespace to use in the underlying storage provider. */
    namespace: string;

    setItem<T>(key: TypedStorageKey<T> | string, value: T): void;
    getItem<T>(key: string | TypedStorageKey<T>): string | T;
    removeItem<T>(key: TypedStorageKey<T> | string): void;
}