export type StringToNumber<S> = S extends `${infer N extends number}` ? N : never;
