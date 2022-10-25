# Merge sort

## Description
Given a tuple of literal number types, this type can sort the tuple into ascending or descending order.


## Sorting Example
```
type Nums = [0, 1, -2, 2.9, 3, 3.4, -5.67, -80, 99];
type Ascending = MergeSort<Nums>
//   ^? type Ascending = [-80, -5.67, -2, 0, 1, 2.9, 3, 3.4, 99]
type Descending = MergeSort<Nums, false>
//   ^? type Descending = [99, 3.4, 3, 2.9, 1, 0, -2, -5.67, -80]
```