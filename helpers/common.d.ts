export type Length<T extends any[]> = T["length"];
export type Tuple<N extends number, T = any, Ret extends T[] = []> = Length<Ret> extends N
  ? Ret
  : Tuple<N, T, [...Ret, T]>;
export type Cast<X, Y> = X extends Y ? X : Y;
