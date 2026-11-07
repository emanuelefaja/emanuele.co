---
title: "Breadth First Search vs Depth First Search."
date: 2023-03-18T06:52:09Z
categories: [artificial-intelligence, essays]
---

Lately, I’ve been going deep into AI search and what the practical use cases of this are at work. Interestingly, my university studies also cover this topic simultaneously, so it feels like I am hitting two birds with one stone.

## Graph Theory.

Let’s start by explaining graph theory, which is a branch of mathematics that studies graphs. These are not the typical graphs you might think of, but more like nodes and lines.

These structures consist of vertices (also called nodes or points) connected by edges (also called arcs or lines). Graphs are used to model various phenomena in various fields, such as computer science, social networks, transportation systems, chemistry, biology, and physics.

Graph theory analyses and studies graphs for their properties and structures. The properties of graphs include their connectivity, degree distribution, paths, cycles, planarity, colourability, and many more. Graph theory has many practical applications, such as in the design and analysis of computer algorithms, the optimisation of network flows, the analysis of social networks, the design of circuits, and the study of DNA sequences.

Some of the key concepts in graph theory include:

-   **Vertices:** The individual points or nodes in a graph.
-   **Edges:** The connections between vertices in a graph.
-   **Degree:** The number of edges incident to a vertex.
-   **Paths:** A sequence of vertices and edges that connect two vertices in a graph.
-   **Cycles:** A path that starts and ends at the same vertex.
-   **Connectedness:** A property that describes whether or not all vertices in a graph can be reached from each other.
-   **Planarity:** A property that describes whether or not a graph can be drawn without any edge crossings.

Graph theory has many practical applications in computer science, operations research, and various other fields.

## BFS & DFS.

Today I want to discuss two key ways of searching the graph for the best method to go from a starting node to an end node (often also called a “goal” node).

These are Breadth First Search (BFS) and Depth First Search (DFS).

Breadth First Search (BFS) is an algorithm that starts at the root node (or any arbitrary node) and explores all the neighbours of the current node before moving on to the next level of nodes. BFS is guaranteed to find the shortest path between two nodes in an unweighted graph. It is also commonly used to find the shortest path in a maze or a grid. The time complexity of BFS is O(V+E), where V is the number of vertices and E is the number of edges in the graph.

Depth First Search (DFS), on the other hand, starts at the root node (or any arbitrary node) and explores as far as possible along each branch before backtracking. DFS is used to find connected components in a graph, detect cycles in a graph, and solve puzzles such as Sudoku and the Eight Queens Problem. The time complexity of DFS is O(V+E), where V is the number of vertices and E is the number of edges in the graph.

I also want to highlight that these are not the only graph search methods.

1.  **Dijkstra’s algorithm:** Dijkstra’s algorithm finds the shortest path between a starting node and all other nodes in a weighted graph. It is similar to BFS but considers the weights of the edges.
2.  **A *search:*** *A* search is an extension of Dijkstra’s algorithm that uses heuristics to search more efficiently. It is often used in pathfinding applications.
3.  **Iterative Deepening Depth First Search (IDDFS):** IDDFS is a hybrid of BFS and DFS that uses DFS to search for a target node, but with a maximum depth limit. The depth limit is increased in each iteration until the target node is found.
4.  **Best First Search:** Best First Search is a search algorithm that uses a heuristic function to guide the search towards the most promising path. It is often used in pathfinding applications where the goal is to find the shortest path between two nodes.
5.  **Bidirectional search:** Bidirectional search is a search algorithm that simultaneously searches from the start node and the goal node, and meets in the middle. It is often used to speed up searches in large graphs.

The interesting thing here is to know when to use BFS vs DFS. This depends on the problem you are trying to solve and the (expected) structure of the graph.

Use BFS:

1.  When finding the shortest path between two nodes in an unweighted graph. BFS guarantees that you will find the shortest path.
2.  When the graph is small and dense, in this case, BFS can be faster than DFS because it visits nodes in order of their distance from the starting node.
3.  When you must find all nodes within a certain distance from the starting node, BFS visits nodes in increasing order of distance from the starting node, which is well-suited for this kind of search.
4.  When finding the minimum number of hops required to reach a node. Since BFS visits nodes in order of their distance from the starting node, it can be used to find the minimum number of hops required to reach a node.

Use DFS:

1.  When you need to explore all possible paths in a graph, DFS is well-suited for this kind of search because it explores a single path as far as possible before backtracking and exploring another path.
2.  When the graph is large and sparse, DFS can be faster than BFS in this case because it does not visit all nodes but only explores the paths that are likely to lead to the desired node.
3.  When you need to detect cycles in a graph, DFS can be used to detect cycles because it will visit the same node more than once if a cycle exists.
4.  When memory usage is a concern, DFS uses less memory than BFS because it only needs to store information about the path it is currently exploring.

These are general guidelines, and not strict rules. So the frustrating answer is that “it depends” based on the specifics of what you are trying to do.

The other thing to keep in mind is that BFS and DFS will use different amounts of resources and memory, and because we do not have infinite compute power at our disposal, this is something that we should always consider unless we are dealing with trivial amounts of data (i.e. a small graph).

When using BFS to traverse a graph, the algorithm visits all nodes at a given depth before proceeding to nodes at the next depth. In order to keep track of which nodes have been visited but not yet explored, BFS uses a queue data structure to store the nodes that are at the current depth. As the algorithm progresses, the queue grows in size as more nodes are added to it. The maximum size of the queue is reached when all nodes at the maximum depth have been added to the queue.

The space complexity of BFS depends on the size of the queue. In the worst case, the size of the queue can be as large as the number of nodes in the graph, which is O(V), where V is the number of vertices in the graph. This can happen when the graph is a complete binary tree or has a high branching factor, such as a tree with a large number of children per node. The space complexity of BFS can be reduced by using techniques such as iterative deepening or bidirectional search, which limit the depth of the search or use two searches to meet in the middle.

When using DFS to traverse a graph, the algorithm explores as far as possible along each path before backtracking and exploring another path. To keep track of the nodes on the current path, DFS uses a stack data structure. Each time the algorithm visits a new node, it adds the node to the top of the stack. When the algorithm reaches a dead end or completes a path, it removes the most recently added node from the stack and backtracks to the previous node. This can reduce memory and resource usage.

The space complexity of DFS depends on the maximum depth of the search tree, which is the length of the longest path in the graph. In the worst case, the size of the stack can be as large as the maximum depth of the search tree. If the graph is a deep path or has many cycles, the stack can grow to be quite large. The space complexity of DFS is O(V) in the worst case, where V is the number of vertices in the graph.

Overall, the space complexity of DFS is usually lower than that of BFS because it only needs to store information about the current path being explored, rather than all nodes at each level of the search tree. However, the space complexity of DFS can still be significant in graphs with deep paths or many cycles.

So we can see that the “shape” of the graph can affect this a lot. If it is very wide we may use one technique, or combination of techniques, while if it is very deep (or even of an unknown depth!) then we may use another technique.

Here are a few additional points to keep in mind when working with graph traversal algorithms:

1.  The choice between BFS and DFS depends on the specific problem you are trying to solve and the characteristics of the graph. In some cases, it may be necessary to use a combination of both algorithms, or a specialized algorithm such as Dijkstra’s algorithm or A\* search.
2.  Both BFS and DFS can be implemented using either an iterative or recursive approach. In general, iterative implementations are faster and use less memory, while recursive implementations are simpler and more intuitive.
3.  Both BFS and DFS can be used to solve a wide range of graph problems, including finding the shortest path, detecting cycles, identifying connected components, and more.
4.  When implementing BFS or DFS, it is important to keep track of the nodes that have already been visited in order to avoid revisiting nodes and getting stuck in infinite loops.
5.  In addition to memory usage, the time complexity of BFS and DFS is also an important consideration. Both algorithms have a time complexity of O(V+E) in the worst case, where V is the number of vertices and E is the number of edges in the graph.
6.  Finally, it is worth noting that there are many variations and extensions of BFS and DFS that can be used depending on the specific problem and the characteristics of the graph. Some of these include bidirectional search, heuristic search, parallel search, and more.

The second point I mention about iterative or recursive approaches is specifically important because it can have a huge impact on the required resource allocation for the project.

Iterative implementation involves using a loop to repeatedly visit nodes and update data structures such as the queue or stack. The loop continues until all nodes have been visited or until a target node has been found. The iterative approach is often preferred for BFS and DFS because it is generally faster and uses less memory than the recursive approach. This is because iterative implementations avoid the overhead associated with function calls and memory allocation for the call stack.

Recursive implementation involves calling a function to visit each node and recursively call itself to visit neighboring nodes. Each recursive call adds a new stack frame to the call stack, which can grow to be quite large for deep paths or many cycles. Recursive implementations are simpler and more intuitive than iterative implementations, but they may be slower and use more memory due to the overhead associated with function calls and the call stack.

It’s worth noting that both iterative and recursive implementations are valid and can be used depending on the specific problem and the characteristics of the graph. The choice between iterative and recursive implementation depends on factors such as the size and structure of the graph, the available resources, and personal preference. In general, iterative implementations are faster and use less memory, while recursive implementations are simpler and more intuitive.

**In conclusion, understanding the advantages and limitations of different graph traversal algorithms is vital: we can make better decisions when designing algorithms and solving real-world problems.**
