import { Length, StringToNumber } from "./common";
import { Sub } from "./numbers";

export type Tail<Arr extends any[]> = Arr extends [any, ...infer U] ? U : [];

/** A union type of the indices for an array */
export type Indices<Arr extends any[]> = StringToNumber<keyof Arr>;

export type IsAtLeastLength<Arr extends any[], N extends number> = N extends Indices<[...Arr, any]>
  ? true
  : false;

/** Replaces the value at T[Index] with V */
export type Replace<
  T extends any[],
  Index extends number,
  V,
  Ret extends any[] = []
> = Length<Ret> extends Length<T>
  ? Ret
  : Length<Ret> extends Index
    ? Replace<T, Index, V, [...Ret, V]>
    : Replace<T, Index, V, [...Ret, T[Length<Ret>]]>;

/** Finds the first index of S in T, if it is not present returns -1 */
export type IndexOf<T extends any[], S, Acc extends any[] = []> =
  T extends [infer First, ...infer Rest]
    ? First extends S
      ? Length<Acc>
      : IndexOf<Rest, S, [...Acc, any]>
    : -1;

/** Filters instances of F out of T*/
export type Filter<T extends any[], F, Ret extends any[] = []> =
  T extends [infer First, ...infer Rest]
    ? Filter<Rest, F, [...Ret, ...(First extends F ? [] : [First])]>
    : Ret;

/** Splits T into [T.slice(0, Index), T.slice(Index)] */
export type Slice<
  T extends any[],
  Index extends number,
  FirstPart extends any[] = []
> = Length<FirstPart> extends Index
  ? [FirstPart, T]
  : T extends [infer First, ...infer Rest]
    ? Slice<Rest, Index, [...FirstPart, First]>
    : [FirstPart, []];

// Splits an array in half, returned as [FirstHalf, SecondHalf]
export type SplitArr<
  Arr extends any[],
  Ret1 extends any[] = [],
  Ret2 extends any[] = []
> = IsAtLeastLength<Arr, 2> extends false
  ? [[...Ret1, ...Arr], Ret2]
  : Arr extends [infer H, ...infer Middle, infer T]
    ? SplitArr<Middle, [...Ret1, H], [T, ...Ret2]>
    : never;
/**
 * Turns an array type into a string so that we can use autocomplete to generate the array.
 *
 * Setting IncludeQuote to true makes it simpler to transform the string back into an array
 * because the elements that are strings are wrapped with quotes, while setting it to false
 * makes it prettier to look at when mousing over or using the two-slash-queries preview
 */
export type StringifyArray<
  T extends any[],
  IncludeQuote = true,
  Ret extends string = "[",
  Count extends any[] = [],
  PostElement extends string = Sub<Length<T>, Length<Count>> extends 1 ? "" : ", ",
  Quote extends string = IncludeQuote extends true ? '"' : ""
> = Length<Count> extends Length<T>
  ? `${Ret}]`
  : StringifyArray<
    T,
    IncludeQuote,
    T[Length<Count>] extends any[]
      ? `${Ret}${StringifyArray<T[Length<Count>], IncludeQuote>}${PostElement}`
      : `${Ret}${T[Length<Count>] extends string ? Quote : ""}${T[Length<Count>]}${T[Length<Count>] extends string ? Quote : ""}${PostElement}`,
    [...Count, any]
  >;