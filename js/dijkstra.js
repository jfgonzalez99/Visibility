function findPath(G) {
    console.log(G.nodes);
    console.log(G.edges);

    // Clean up graph
    G = prune(G);

    console.log(G.nodes);
    console.log(G.edges);
}