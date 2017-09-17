export class MockStorage implements Storage {
    [x: string]: any;
    constructor(private s: {}) {}

    public getItem(key: string): string {
        return this.s[key] ? "" + this.s[key] : null;
    }

    public setItem(key: string, value: any): void {
        this.s[key] = value.toString();
    }

    public removeItem(key: string): void {
        delete this.s[key];
    }

    public get length(): number {
        return Object.keys(this.s).length;
    }

    public key(n: number): string {
        return Object.keys(this.s)[n];
    }

    public clear(): void {
        for (const k of Object.keys(this.s)) {
            delete this.s[k];
        }
    }
}
