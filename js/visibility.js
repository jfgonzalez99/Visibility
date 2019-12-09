
function visbilityGraph(G) {
    console.log(G);
    var V = G.nodes;
    var E = G.edges;
    n = V.length;
    m = E.length;

    // var angles = [];
    for (let i = 0; i < n; i++) {
        var uAngles = [];
        for (let j = 0; j < n; j++) {
            u = V[i]
            v = V[j]

            if (u != v) {
                // Calculate counter clockwise angles
                var angleDeg = Math.atan2(v.y - u.y, v.x - u.x) * -180 / Math.PI;
                if (angleDeg < 0) {
                    angleDeg = 360 + angleDeg;
                }
                uAngles.push([j,angleDeg]);
            }
        }
        // Sort angles by increasing angle
        uAngles.sort(function(a,b) {
            return a[1] - b[1];
        });

        var edgeLists = [];
        uAngles.forEach(a => {
            u = V[i]
            // Scan line passes through v
            v = V[a[0]]

            // // Initialize scan vector
            // s = {x:0,y:0};
            
            // // Create scan line
            // len_uv = Math.sqrt(Math.pow(u.x - v.x, 2.0) + Math.pow(u.y - v.y, 2.0));
            // // Extend to arbitrary length
            // s.x = v.x + (v.x - u.x) / len_uv * 5000;
            // s.y = v.y + (v.y - u.y) / len_uv * 5000;
            var edgeList = [];
            for (let k = 0; k < m; k++) {
                var e = E[k];
                var intersect = intersection(u.x,u.y,v.x,v.y,e.x1,e.y1,e.x2,e.y2);

                if (intersect != false && intersect != "parallel") {
                    edgeList.push([k, intersect]);
                }
            }
            edgeList.sort(function(a,b) {
                return distance(u,a[1]) - distance(u,b[1]);
            });
            edgeLists.push([a[0],edgeList]);
        }); 
        
        console.log(edgeLists);
    }
}

function distance(u,v) {
    var d = Math.sqrt(Math.pow(u.x - v.x, 2.0) + Math.pow(u.y - v.y, 2.0));
    return d;
}


// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersection(x1, y1, x2, y2, x3, y3, x4, y4) {

  // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
    if (denominator === 0) {
        return "parallel"
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

  // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return {x, y}
}

