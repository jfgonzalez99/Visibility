// Create svg canvas
var svg = d3.select("#visualization")
            .append("svg")
            .attr("width", "73vw")
            .attr("height", "80vh");

// Group edges before nodes so nodes appear on top of edges
var vis_visibility_edges = svg.append('g').attr('id','vis-visibility-edges');
var vis_edges = svg.append('g').attr('id','vis-edges');
var vis_nodes = svg.append('g').attr('id','vis-nodes');

// Keep track of which button has been clicked
var states = {
    "#nodes": 1,
    "#edges": 0,
    "#select": 0,
    "#compute": 0,
    "#find": 0,
    "#clear": 0
};

// Button behavior
var buttons = ["#nodes","#edges","#select","#compute","#find","#clear"];
buttons.forEach(button => {
    b = d3.select(button);
    b.on('click', function() {
        // Toggle states of all other buttons
        buttons.forEach(otherButton => {
            oB = d3.select(otherButton);
            if (button == otherButton) {
                states[button] = 1;
                oB.classed('active',true);
            }
            else {
                states[otherButton] = 0;
                oB.classed('active',false);
            }
        });
        // Clear visualization if clear button clicked
        if (button == "#clear") {
            // Remove nodes
            d3.selectAll('.node-circle').remove();
            graph.nodes = [];
            // Remove edges
            d3.selectAll('.edge-line').remove();
            graph.edges = [];
            // Remove endpoints
            endpoints = [];
            // Remove start and end
            startEnd = [];
            graph.start = 0;
            graph.end = 0;
            d3.selectAll('.label').remove();
            // Remove visibility lines
            d3.selectAll('.visibility-line').remove();
        }
        else if (button == "#compute") {
            $.getScript('js/visibility.js',function() {
                visGraph.nodes = graph.nodes;
                visGraph.edges = visbilityGraph(graph);
                visGraph.start = graph.start;
                visGraph.end = graph.end;
                
                drawVisibilityEdges(visGraph.nodes,visGraph.edges);
            });
        }
        else if (button == "#find") {
            visGraph.start = graph.start;
            visGraph.end = graph.end;
            $.getScript('js/dijkstra.js',function() {
                var path = findPath(visGraph);
                drawPath(path);
            });
        }
    });
});


// Keep track of endpoints for edges
var endpoints = [];
// Keep track of start and endpoints
var startEnd = [];

// Used to draw circles
function drawCircle(x, y, num) {
    vis_nodes.append('circle')
       .attr('class', 'node-circle')
       .attr('id', num)
       .attr('fill','#1D2326')
       .attr('cx', x)
       .attr('cy', y)
       .attr('r', 8)
       .on('click', function(){
            if (states['#edges']) {
                c = d3.select(this);
                c.attr('fill','#5990D9');
                var n = endpoints.push(c);
                drawEdges(n); 
            }
            else if (states['#select']) {
                c = d3.select(this);
                var n = startEnd.push(c);
                selectStartEnd(n);
            }
       });
}

var graph = {
    nodes: [],
    edges: [],
    start: 0,
    end: 0
}

var visGraph = {
    nodes: [],
    edges: [],
    start: 0,
    end: 0
}

svg.on('click', function() {
    if (states['#nodes']) {
        var coords = d3.mouse(this);
        var num = graph.nodes.push({x:coords[0],y:coords[1]});
        drawCircle(coords[0], coords[1], num - 1);
    }
});

function drawPath(path) {
    var n = path.length;
    console.log(graph.nodes);
    
    for (let i = 0; i < n - 1; i++) {
        var c1 = graph.nodes[path[i]];
        var c2 = graph.nodes[path[i + 1]];

        // Draw edge
        vis_edges.append('line')
                 .attr('class','edge-line')
                 .attr('x1',c1.x)
                 .attr('y1',c1.y)
                 .attr('x2',c2.x)
                 .attr('y2',c2.y)
                 .attr('stroke-width', 3)
                 .attr('stroke','#bf8360');
    }
}

function drawEdges(n) {
    if (n == 2) {
        var c1 = endpoints[0];
        var c2 = endpoints[1];

        // Clear endpoints
        endpoints = [];

        // Add to edges
        graph.edges.push({
            x1:c1.attr('cx'),
            y1:c1.attr('cy'),
            x2:c2.attr('cx'),
            y2:c2.attr('cy')
        });

        // Reset node colors
        c1.attr('fill','#1D2326')
        c2.attr('fill','#1D2326')

        // Draw edge
        vis_edges.append('line')
           .attr('class','edge-line')
           .attr('x1',c1.attr('cx'))
           .attr('y1',c1.attr('cy'))
           .attr('x2',c2.attr('cx'))
           .attr('y2',c2.attr('cy'))
           .attr('stroke-width', 3)
           .attr('stroke','#1D2326');
    }
}

function selectStartEnd(n) {
    if (n == 1) {
        if (graph.start != 0) {
            graph.start.attr('fill','#1D2326');
            graph.end.attr('fill','#1D2326');
            graph.start = 0;
            graph.end = 0;
            d3.selectAll('.label').remove();
        }

        c1 = startEnd[0];
        c1.attr('fill','#bf8360');

        vis_nodes.append('text')
           .attr('class','label')
           .text('Start')
           .attr('x',c1.attr('cx'))
           .attr('y',c1.attr('cy') - 15);
    }
    if (n == 2) {
        c2 = startEnd[1];
        c2.attr('fill','#bf8360');

        vis_nodes.append('text')
           .attr('class','label')
           .text('End')
           .attr('x',c2.attr('cx'))
           .attr('y',c2.attr('cy') - 15);

        // Store starting and ending points
        graph.start = c1;
        graph.end = c2;

        // Clear starting and ending points
        startEnd = []
    }
}

function drawVisibilityEdges(V,E) {
    var m = E.length;
    var n = V.length;

    for (let i = 0; i < m; i++) {
        var j = E[i][0];
        var k = E[i][1];
        // console.log(j,k);
        
        var u = V[j];
        var v = V[k];

        // Draw edge
        vis_visibility_edges.append('line')
           .attr('class','visibility-line')
           .attr('x1',u.x)
           .attr('y1',u.y)
           .attr('x2',v.x)
           .attr('y2',v.y)
           .attr('stroke-width', 3)
           .attr('stroke','#5990D9');
    }
}
