import { Length, Tuple } from "./common";

export type Add<N extends number, M extends number> = Length<[...Tuple<N>, ...Tuple<M>]>;
export type Sub<N extends number, M extends number> =
Tuple<N> extends [...Tuple<M>, ...infer U]
  ? Length<U>
  : `-${Sub<M, N>}` extends `${infer Ret extends number}`
    ? Ret
    : never;
export type IsNegative<N extends number> = `${N}` extends `-${infer _}` ? true : false;
/** Returns the positive value of a number or -1 if it is already positive */
type ToPositive<N extends number> = `${N}` extends `-${infer NPos extends number}` ? NPos : -1;
/** Returns the negative value of a number or 1 if it is already negative */
type ToNegative<N extends number> = `-${N}` extends `${infer NNeg extends number}` ? NNeg : 1;

/** Compares two nonnegative integers */
export type IntegerNGreaterThanM<N extends number, M extends number> = N extends M
  ? false
  : IsNegative<Sub<M, N>>;

/**
 * Splits a number into the section before and after the decimal
 * @example
 * DecimalString<12.34>
 * // => [12, '34']
 */
type DecimalString<N extends number> =
  `${N}` extends `${infer BeforeDecimal extends number}.${infer AfterDecimal}`
    ? [BeforeDecimal, AfterDecimal]
    : [N, "0"];
/**
 * Returns the first section of a decimal string as a number and the rest as a string
 * @example
 * DecimalStringSplit<'345'>
 * // => [3, '45']
 */
type DecimalStringSplit<S extends string> =
  S extends `${infer H extends number}${infer T}` ? [H, T] : never;
type SplitRet = [number, string];
/**
 * A comparison for numbers after the decimal, represented as strings
 * @example
 * SGreaterThanT<'5', '49'>
 * // => true
 */
type SGreaterThanT<
  S extends string,
  T extends string,
  SSplit extends SplitRet = DecimalStringSplit<S>,
  TSplit extends SplitRet = DecimalStringSplit<T>,
  Concatenated = `${SSplit[1]}${TSplit[1]}`
> = SSplit[0] extends TSplit[0]
  ? // We've reached the end of both strings
    Concatenated extends ""
    ? false // they are equal
    : Concatenated extends TSplit[1]
    ? false // there is more left at the end of T
    : Concatenated extends SSplit[1]
    ? true // there is more left at the end of S
    : SGreaterThanT<SSplit[1], TSplit[1]>
  : IntegerNGreaterThanM<SSplit[0], TSplit[0]>;
/** Compares two nonnegative rational numbers */
type PositiveNGreaterThanM<
  N extends number,
  M extends number,
  NSplit extends SplitRet = DecimalString<N>,
  MSplit extends SplitRet = DecimalString<M>
> = NSplit[0] extends MSplit[0]
  ? SGreaterThanT<NSplit[1], MSplit[1]>
  : IntegerNGreaterThanM<NSplit[0], MSplit[0]>
/** Compares two rational numbers */
export type NGreaterThanM<
  N extends number,
  M extends number,
  Positives = [ToPositive<N>, ToPositive<M>]
> = Positives extends [-1, -1]
  ? PositiveNGreaterThanM<N, M>
  : Positives extends [number, -1]
    ? false
    : Positives extends [-1, number]
      ? true
      : Positives extends [infer PosN extends number, infer PosM extends number]
      ? PositiveNGreaterThanM<PosM, PosN> : false