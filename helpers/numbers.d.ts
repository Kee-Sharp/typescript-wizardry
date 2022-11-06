import { Cast, Length, Tuple } from "./common";

export type Add<N extends number, M extends number> = Cast<Length<[...Tuple<N>, ...Tuple<M>]>, number>;
export type Sub<N extends number, M extends number> =
Tuple<N> extends [...Tuple<M>, ...infer U]
  ? Length<U>
  : `-${Sub<M, N>}` extends `${infer Ret extends number}`
    ? Ret
    : never;
export type IsNegative<N extends number> = `${N}` extends `-${infer _}` ? true : false;
/** Returns the positive value of a number or -1 if it is already positive */
type ToPositive<N extends number> = `${N}` extends `-${infer NPos extends number}` ? NPos : -1;
/** Returns the absolute value of a number */
type Absolute<N extends number> = `${N}` extends `-${infer NPos extends number}` ? NPos : N;
/** Returns the negative value of a number or 1 if it is already negative */
type ToNegative<N extends number> = `-${N}` extends `${infer NNeg extends number}` ? NNeg : 1;
/** Returns N * -1 */
type Opposite<N extends number> = `${N}` extends `-${infer NPos extends number}` ? NPos : ToNegative<N>;

/** Compares two nonnegative integers */
export type IntegerNGreaterThanM<N extends number, M extends number> = N extends M
  ? false
  : IsNegative<Sub<M, N>>;

/** Adds two integers N and M */
export type FullAdd<
  N extends number,
  M extends number,
  PositivesWithError = [ToPositive<N>, ToPositive<M>],
  Absolutes extends [number, number] = [Absolute<N>, Absolute<M>]
> = PositivesWithError extends [-1, -1]
  ? Add<N, M>
  : PositivesWithError extends [-1, number]
    ? Sub<N, Absolutes[1]>
    : PositivesWithError extends [number, -1]
      ? Sub<M, Absolutes[0]>
      : ToNegative<Add<Absolutes[0], Absolutes[1]>>

/** Subtracts integer M from integer N */
export type FullSub<N extends number, M extends number> = FullAdd<N, Opposite<M>>

type MultiplyHelper<N extends number, M extends number> =
  Add<N, M> extends N | M
    ? 0
    : N extends 1
      ? M
      : Add<M, MultiplyHelper<Sub<N, 1>, M>>
export type Multiply<N extends number, M extends number> =
  IntegerNGreaterThanM<N, M> extends true ? MultiplyHelper<M, N> : MultiplyHelper<N, M>
/** Multiplies two integers N and M */
export type FullMultiply<
  N extends number,
  M extends number,
  PositivesWithError = [ToPositive<N>, ToPositive<M>],
  Absolutes extends [number, number] = [Absolute<N>, Absolute<M>],
> = 
  Multiply<Absolutes[0], Absolutes[1]> extends infer MultiplyResult extends number
  ? PositivesWithError extends [-1, -1]
    ? MultiplyResult
    : PositivesWithError extends [-1, number] | [number, -1]
      ? MultiplyResult extends 0
        ? 0
        : ToNegative<MultiplyResult>
      : MultiplyResult
  : never;

/** Returns the quotient and remainder for the division of N by M */
type DivideWithRemainder<
  N extends number,
  M extends number,
  Result extends any[] = [],
> = Tuple<N> extends [...Tuple<M>, ...infer Rest]
  ? DivideWithRemainder<Length<Rest>, M, [...Result, any]>
  : [quotient: Length<Result>, remainder: N];

/** Returns just the quotient for the division of N by M. Assumes both N and M are positive */
type Divide<
  N extends number,
  M extends number,
  Result extends any[] = [],
> = Tuple<N> extends [...Tuple<M>, ...infer Rest]
  ? Divide<Length<Rest>, M, [...Result, any]>
  : Length<Result>;
/** Returns the quotient for the division of N by M */
export type FullDivide<
  N extends number,
  M extends number,
  PositivesWithError = [ToPositive<N>, ToPositive<M>],
  Absolutes extends [number, number] = [Absolute<N>, Absolute<M>]
> = PositivesWithError extends [-1, -1]
  ? Divide<N, M>
  : PositivesWithError extends [number, -1] | [-1, number]
    ? ToNegative<Divide<Absolutes[0], Absolutes[1]>>
    : Divide<Absolutes[0], Absolutes[1]>
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