import { mappable } from 'simple-mapper';

export class Mine {
    Id: number = 3;
    One: string = "string";
    Two: number = 3.14;
    Three: string = null;
}

export class MineTwo {
    Id: number = 3;
    Another: string = "for me";
    get Computed(): string { return this.Another + " and me" };
}

export class MineMinusTwo {
    Id: number = 3;
    One: string = "string";
    Three: string = null;
}

export class Nested_MineTwo {
    Id: number = 3;
    Another: string = "for me";
    get Computed(): string { return this.Another + " and me" };
}
export class Nested_Mine {
    Id: number = 3;
    One: string = "string";
    @mappable("Nested_MineTwo")
    Prop: Nested_MineTwo = null;
}

export class Observable_MineTwo {
    Id: number = 3;
    Another: string = "for me";
    get Computed(): string { return this.Another + " and me" };
}
export class Observable_Mine {
    Id: number = 3;
    One: string = "string";
    @mappable("Observable_MineTwo")
    Prop: Observable_MineTwo = null;
}

export class NestedArrayTypes_MineTwo {
    Id: number = 3;
    Another: string = "for me";
    get Computed(): string { return this.Another + " and me" };
}
export class NestedArrayTypes_Mine {
    Id: number = 3;
    One: string = "string";
    @mappable("NestedArrayTypes_MineTwo")
    Props: NestedArrayTypes_MineTwo[] = null;
}
