# Maze Solver

## Description
Given a maze represented as a 2d tuple type, this type can find the shortest path from the start to the goal, if one exists. Works by using a breadth-first position search through the all the positions until the goal is reached.

## Maze Cell Format
- Start Position: `'S'`
- Goal Position: `'G'`
- Walls: `'|'`
- Free Space: `'_'`

## Maze Example
```
type TestMaze = [
  ['S', '_', '|', 'G'],
  ['|', '_', '|', '_'],
  ['|', '_', '_', '_'],
];
type TestPath = MazeSolver<TestMaze>
//   ^? type TestPath = ['Right', 'Down', 'Down', 'Right', 'Right', 'Up', 'Up']
```