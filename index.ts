// Some examples of the algorithms in this repo

import { Equal as BaseEqual, Expect } from '@type-challenges/utils';
import { EquationSolver } from './EquationSolver';
import { StringifyArray } from './helpers/array';
import { Length } from './helpers/common';
import { MazeSolver } from './MazeSolver';
import { MergeSort } from './MergeSort';
import { NQueens } from './NQueens';
type Equal<X, Y> = BaseEqual<X, Y> extends true ? true : X;


/** Maze Solver */

type TestMaze1 = [
  ['S', '_', '|', 'G'],
  ['|', '_', '|', '_'],
  ['|', '_', '_', '_'],
];
type TestMaze2 = [
  ['_', '_', '_', '_', '_', '_'],
  ['_', '|', '|', '|', '|', '_'],
  ['_', '_', '|', '|', 'G', '_'],
  ['|', '_', '|', '|', '|', '|'],
  ['_', '_', '_', '_', '_', '_'],
  ['_', '|', '|', '_', '_', '_'],
  ['_', 'S', '_', '_', '_', '_'],
];
type TestMaze3 = [
  ['G', '_', '_', '|'],
  ['_', '_', '|', '_'],
  ['_', '|', '_', '_'],
  ['|', '_', '_', 'S'],
];

type MazeCases = [
  Expect<Equal<MazeSolver<TestMaze1>, ['Right', 'Down', 'Down', 'Right', 'Right', 'Up', 'Up']>>,
  Expect<Equal<MazeSolver<TestMaze2>, ['Left', 'Up', 'Up', 'Right', 'Up', 'Up', 'Left', 'Up', 'Up', 'Right', 'Right', 'Right', 'Right', 'Right', 'Down', 'Down', 'Left']>>,
  Expect<Equal<MazeSolver<TestMaze3>, 'no possible path'>>
];

/** N Queens */

const stringResult: StringifyArray<NQueens<4>> = '[[["_", "Q", "_", "_"], ["_", "_", "_", "Q"], ["Q", "_", "_", "_"], ["_", "_", "Q", "_"]], [["_", "_", "Q", "_"], ["Q", "_", "_", "_"], ["_", "_", "_", "Q"], ["_", "Q", "_", "_"]]]';
const result: NQueens<4> = [
  [
    ["_", "Q", "_", "_"],
    ["_", "_", "_", "Q"],
    ["Q", "_", "_", "_"],
    ["_", "_", "Q", "_"]
  ],
  [
    ["_", "_", "Q", "_"],
    ["Q", "_", "_", "_"],
    ["_", "_", "_", "Q"],
    ["_", "Q", "_", "_"]
  ]
];

// Correct number of solutions sourced from: 
// http://web.math.ucsb.edu/~padraic/ucsb_2014_15/ccs_problem_solving_w2015/N-Queens%20presentation.pdf
type NQueensCases = [
  Expect<Equal<Length<NQueens<1>>, 1>>,
  Expect<Equal<Length<NQueens<2>>, 0>>,
  Expect<Equal<Length<NQueens<3>>, 0>>,
  Expect<Equal<Length<NQueens<4>>, 2>>,
  Expect<Equal<Length<NQueens<5>>, 10>>,
  Expect<Equal<Length<NQueens<6>>, 4>>,
]

/** Merge Sort */

type Nums = [4, 2, 1.35, 1.4, 5, 7, -5, 1, 0, -10, 1.37, 6.4, 3, -21, 0.8, -16.5];
type Ascending = MergeSort<Nums>;
//   ^?
type Descending = MergeSort<Nums, false>;
//   ^?

/** Equation Solver */

type EquationCases = [
  Expect<Equal<EquationSolver<'3+4'>, 7>>,
  Expect<Equal<EquationSolver<'1+2*3/4-5'>, -3>>,
  Expect<Equal<EquationSolver<'2*(3+87)/4*9-32*5+6'>, 251>>,
  Expect<Equal<EquationSolver<'5&6'>, 'unrecognized operator &'>>,
];
