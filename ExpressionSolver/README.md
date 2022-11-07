# Expression Solver

## Description
Given a string containing a mathematical expression, this type can evaluate the expression or determine if it is invalid. First, the expression is split up into an array of numbers and operators to enable the following algorithms to work with greater than 1-digit numbers. Second, the expression is converted into an array resembling the postfix notation string, also known as **RPN**, by using the **Shunting-Yard** algorithm. Finally, the **RPN** array is reduced down to the final numerical value.

## Supported Expression Inputs
- Numbers:
  - Integers (numbers with 3 digits or more are allowed but the computation grows slower)
  - _Variables planned next_
- Operators:
  - Addition: `'+'`
  - Subtraction: `'-'`
  - Multiplication: `'*'`
  - Division: `'/'`
  - Parentheses: `'(' | ')'`

## Expression Example
```
type Expression = '6+(27-12)/5*4';
type Value = ExpressionSolver<Expression>;
//   ^? type Value = 18
```