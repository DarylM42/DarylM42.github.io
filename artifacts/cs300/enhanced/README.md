# CS 300 Project Two - Milestone Three Enhancements

This milestone enhances the original Binary Search Tree (BST) advising program by introducing an AVL tree implementation that preserves BST ordering while keeping the tree balanced.

## Files

- `ProjectTwo.cpp`: main menu flow, CSV loading, AVL-backed advising operations
- `Node.h` / `Node.cpp`: `Course` and `TreeNode` definitions (includes `height`)
- `BST.h` / `BST.cpp`: baseline unbalanced BST used for runtime comparison
- `AVLTree.h` / `AVLTree.cpp`: balanced AVL insert/search/traversal logic
- `Benchmark.h` / `Benchmark.cpp`: optional BST vs AVL timing comparison

## Milestone Three Requirements Completed

1. Converted BST logic to AVL with a separate `AVLTree` class.
2. Added node `height` tracking.
3. Implemented balance factor calculation through `getBalance(node)`.
4. Implemented all four rotations:
   - LL -> right rotation
   - RR -> left rotation
   - LR -> left-right rotation
   - RL -> right-left rotation
5. Replaced unbalanced insert flow with AVL insert flow:
   - insert
   - update height
   - calculate balance
   - apply rotation
   - return new subtree root
6. Added code comments describing height updates, balance decisions, and runtime benefit.
7. Added optional benchmarking for insert/search runtime comparison.
8. Added automated AVL validation checks for LL, RR, LR, and RL rotation-trigger insert orders.
9. Added invariant verification after every insertion in validation runs (balance factor, height consistency, BST ordering).

## Why AVL Improves Runtime

A plain BST can degrade to a linked-list shape in worst-case insert order, making operations close to `O(n)`.
AVL maintains balance so the tree height stays near `log2(n)`, keeping insert and search close to `O(log n)`.

## Menu Options

1. Load course data from `CS_300_ABCU_Advising_Program_Input.csv`
2. Display all courses in alphanumeric order (in-order traversal)
3. Search for a specific course number
4. Run optional BST vs AVL benchmark
5. Run AVL rotation and invariant checks
9. Exit

## Validation and Benchmark Notes for Final Portfolio

- Automated rotation tests intentionally force each AVL rotation pattern:
   - LL: C300, C200, C100
   - RR: C100, C200, C300
   - LR: C300, C100, C200
   - RL: C100, C300, C200
- After each insertion, the AVL invariant check confirms:
   - subtree height difference is at most 1 for every node
   - stored node height values match recomputed subtree heights
   - BST ordering remains valid
- Benchmarking now runs several repetitions on large sorted synthetic input so worst-case BST behavior is observable.
- The small course CSV is still useful for correctness checks, but is too small to reliably demonstrate asymptotic timing differences.

## Build and Run

Compile all source files together:

```bash
g++ -std=c++17 ProjectTwo.cpp Node.cpp BST.cpp AVLTree.cpp Benchmark.cpp -o advising_app
```

Run:

```bash
./advising_app
```

On Windows with MinGW, executable name is commonly `advising_app.exe`.