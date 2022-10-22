import { IsAtLeastLength, SplitArr, Tail } from "./helpers/array";
import { Length } from "./helpers/common";
import { Add, NGreaterThanM } from "./helpers/numbers";

// Combines two already sorted arrays, controlled by the Ascending parameter
type MergeHalves<
  Arr1 extends number[],
  Arr2 extends number[],
  Ascending extends boolean = true,
  Ret extends number[] = []
> = Add<Length<Arr1>, Length<Arr2>> extends Length<Arr1> | Length<Arr2>
  ? [...Ret, ...Arr1, ...Arr2]
  : NGreaterThanM<Arr1[0], Arr2[0]> extends Ascending
    ? MergeHalves<Arr1, Tail<Arr2>, Ascending, [...Ret, Arr2[0]]>
    : MergeHalves<Tail<Arr1>, Arr2, Ascending, [...Ret, Arr1[0]]>;

export type MergeSort<
  Arr extends number[],
  Ascending extends boolean = true
> = IsAtLeastLength<Arr, 2> extends false
  ? Arr
  : SplitArr<Arr> extends [infer Split0 extends number[], infer Split1 extends number[]]
    ? MergeHalves<MergeSort<Split0, Ascending>, MergeSort<Split1, Ascending>, Ascending>
    : Arr;