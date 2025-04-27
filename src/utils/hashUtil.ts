import objectHash from "object-hash";

export function hashObject(obj: any): string {
    const hash = objectHash(obj);
    return hash;
}