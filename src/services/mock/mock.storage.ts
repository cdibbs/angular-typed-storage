export class MockStorage implements Storage {
    [x: string]: any;
    constructor(private s: {}) {}

    public getItem<T>(key: string): T {
        return this.s[key];
    }

    public setItem<T>(key: string, value: any): void {
        this.s[key] = value.toString();
    }

    public removeItem<T>(key: string): void {
        delete this.s[key];
    }

    public get length(): number {
        return Object.keys(this.s).length;
    }
 
    public key(n: number): string {
        return Object.keys(this.s)[n];
    }

    public clear(): void {
        for (var k of Object.keys(this.s)) {
            delete this.s[k];
        }
    }
}