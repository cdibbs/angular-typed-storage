export interface IMapper {
    /** Recursively maps an object into a model.
     * @param {instantiable} t The constructable destination model.
     * @param {any} object The source object.
     * @return {T} The constructed model with all of its properties mapped.
     * @example map(UserViewModel, { "name": "batman" });
     */
    map<T>(t: { new (): T }, object: any): T;
}
