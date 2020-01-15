// This code was inspired by Divyanshu Mehta
// https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/
class Graph {
    constructor(G) {
        this.size = G.nodes.length;
        this.source = parseInt(G.start[0][0]['id']);
        this.target = parseInt(G.end[0][0]['id']);
        this.vertices = G.nodes;

        // Initialize adjacency matrix with zeros
        this.edges = Array(this.size).fill().map(
                        () => Array(this.size).fill(0)
                     );
        
        // Fill adjacency matrix with distances
        var n = G.edges.length;
        for (let i = 0; i < n; i++) {
            var u = G.edges[i][0];
            var v = G.edges[i][1];

            this.edges[u][v] = distance(this.vertices[u],this.vertices[v]);
            this.edges[v][u] = distance(this.vertices[u],this.vertices[v]);
        }
    }

    printSolution(dist) {
        console.log("Vertex","Distance from Source");
        for (let i = 0; i < this.size; i++) {
            console.log(i, dist[i]);
        }
    }

    // Finds vertex not yet in path tree with minimum distance value
    minDistance(dist, sptSet) {
        var min = Infinity;
        var min_index;

        // Find nearest vertex not in the path tree
        for (let i = 0; i < this.size; i++) {
            if (dist[i] < min && !sptSet[i]) {
                min = dist[i];
                min_index = i;
            }
        }
        
        return min_index;
    }

    dijkstra() {
        var dist = [];
        var path = [];
        var sptSet = [];
        for (let i = 0; i < this.size; i++) {
            sptSet.push(0);
            path.push(NaN);
            if (i == this.source) {
                dist.push(0);
            }
            else {
                dist.push(Infinity);
            }
        }
        
        for (let i = 0; i < this.size; i++) {
            // Find minimum distance vertex
            var u = this.minDistance(dist,sptSet);

            // Put min distance vertex in shortest path tree
            sptSet[u] = 1;

            // Update distances for adjacent vertices
            for (let v = 0; v < this.size; v++) {
                if (this.edges[u][v] > 0 && !sptSet[v] 
                    && dist[v] > dist[u] + this.edges[u][v]) {
                    dist[v] = dist[u] + this.edges[u][v];
                    path[v] = u;
                }
            }      
        }
        
        this.targetPath = [];
        this.unrollPath(path,this.target);

        return this.targetPath;
    }

    unrollPath(path, current) {
        if (isNaN(current)) {
            // this.targetPath.push(this.source);
            console.log(this.targetPath);
        }
        else {
            var next = path[current];
            this.targetPath.push(current);
            this.unrollPath(path,next);
        }
    }
}

function findPath(G) {
    var M = new Graph(G);
    return M.dijkstra();
}

function distance(u,v) {
    var d = Math.sqrt(Math.pow(u.x - v.x, 2.0) + Math.pow(u.y - v.y, 2.0));
    return d;
}