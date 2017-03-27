import { URLSearchParams } from '@angular/http';

const mapMetadataKey = "its.appdev.map.decorator";
export function mappable<T>(type: string)
{
    return (target: Object, propertyKey: string | symbol) => {
        let d = Reflect.get(target, mapMetadataKey) || {};
        d[propertyKey] = type;
        //console.log(target, mapMetadataKey, d, type);
        Reflect.set(target, mapMetadataKey, d);
    };
}

export function getMappableProperties<T>(target: Object)
    : { [propKey : string]: string }
{
    return Reflect.get(target, mapMetadataKey) || {};
}