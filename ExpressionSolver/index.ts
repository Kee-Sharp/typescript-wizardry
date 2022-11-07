import { FullAdd, FullDivide, FullMultiply, FullSub, IntegerNGreaterThanM as NGreaterThanM } from "../helpers/numbers";
import { StringToNumber } from "../helpers/string";

type TokenType = string | number;
type OperatorToPrecedence = {
  '(': 0,
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
};
type Operator = keyof OperatorToPrecedence;
type NonParenthesis = Exclude<Operator, '('>;

type ParseExpression<
  E extends string,
  Ret extends TokenType[] = [],
  Previous extends string | null = null
> = E extends `${infer First extends string}${infer Rest extends string}`
  ? StringToNumber<First> extends never
    ? Previous extends string
      ? ParseExpression<Rest, [...Ret, StringToNumber<Previous>, First]>
      : ParseExpression<Rest, [...Ret, First]>
    : ParseExpression<Rest, Ret, `${Previous extends string ? Previous : ''}${First}`>
  : Previous extends string
    ? [...Ret, StringToNumber<Previous>]
    : Ret;

type ShuntingYard<
  E extends TokenType[],
  Output extends TokenType[] = [], // queue
  Operators extends Operator[] = [] // stack so we always pull from the end
> = E extends [infer Token extends TokenType, ...infer RemainingTokens extends TokenType[]]
  ? Token extends Operator
    ? Token extends '('
      ? ShuntingYard<RemainingTokens, Output, [...Operators, Token]>
      : Operators extends [...infer Beginning extends Operator[], infer Last extends Operator]
        ? NGreaterThanM<OperatorToPrecedence[Token], OperatorToPrecedence[Last]> extends true
          ? ShuntingYard<RemainingTokens, Output, [...Operators, Token]> //add to stack
          : ShuntingYard<E, [...Output, Last], Beginning> // move last to output
        : ShuntingYard<RemainingTokens, Output, [Token]>
    : Token extends ')'
      ? Operators extends [...infer Beginning extends Operator[], infer Last extends NonParenthesis]
        ? ShuntingYard<E, [...Output, Last], Beginning>
        : Operators extends [...infer Beginning extends Operator[], infer _Last extends '(']
          ? ShuntingYard<RemainingTokens, Output, Beginning>
          : 'invalid equation, mismatching parentheses'
      : ShuntingYard<RemainingTokens, [...Output, Token], Operators>
  : Operators extends [...infer Beginning extends Operator[], infer Last extends Operator]
    ? ShuntingYard<E, [...Output, Last], Beginning>
    : Output;

type Operation<N extends number, M extends number> = {
  '+': FullAdd<N, M>,
  '-': FullSub<N, M>,
  '*': FullMultiply<N, M>,
  '/': FullDivide<N, M>
}

type RPNParsing<Tokens extends TokenType[], S extends number[] = []> =
  Tokens extends [infer FirstToken extends TokenType, ...infer OtherTokens extends TokenType[]]
    ? FirstToken extends number
      ? RPNParsing<OtherTokens, [...S, FirstToken]>
      : FirstToken extends NonParenthesis
        ? S extends [...infer RestStack extends number[], infer FirstOperand extends number, infer SecondOperand extends number]
          ? RPNParsing<OtherTokens, [...RestStack, Operation<FirstOperand, SecondOperand>[FirstToken]]>
          : 'insufficient operands'
        : `unrecognized operator ${FirstToken}`
    : S[0];

export type ExpressionSolver<E extends string> = RPNParsing<ShuntingYard<ParseExpression<E>>>;