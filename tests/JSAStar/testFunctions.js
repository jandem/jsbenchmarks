// the data type we're using -
// pathfinder is not dependent on this particular one
// all datatypes just have to implement ...
// - the predecessor
// - a positionMatches function that checks if two nodes occupy the same position
// - a positionIdent function that returns a unique string for the current nodes position
// 
// if the node is original and p is not set

var Point = new (function() {
    var width = 0,
        height = 0;

    this.setSize = function (w, h) {
        width = w;
        height = h;
    }

    this.Point = function (x, y) {
        this.x = x;
        this.y = y;
        this.predecessor = null;
        this.cost = 0;
        this.rank = 0;

        if (arguments.length == 3) {
            this.predecessor = arguments[2];

        } else if (arguments.length == 4) {
            this.predecessor = arguments[2];
            this.cost        = arguments[3];

        } else if (arguments.length == 5) {
            this.predecessor = arguments[2];
            this.cost        = arguments[3];
            this.rank        = arguments[4];
        }

        this.samePosition = function(p) {
            return p.x == this.x && p.y == this.y;
        }

        this.toString = function () {
            return '(' + this.x + '|' + this.y + ')[' + this.cost + ']{' + this.rank + '} [id: ' + this.getPosId() + ']';
        }

        this.getPosId = function() {
            return this.y*width + this.x;
        }
    }

    this.getPathAsArray = function (node) {
        var path = [], n = node;
        
        while (n != null) {
            path.push(n);
            n = n.predecessor;
        }
        
        return path;
    }

    
    this.op = {
        compareRank : function (n1, n2) {
            return n1.rank < n2.rank;
        },

        getCost : function (n) {
            return n.cost;
        },
        
        setCost : function (n, cost) {
            n.cost = cost;
        }, 

        getRank : function (n) {
            return n.rank;
        },
        
        setRank : function (n, rank) {
            n.rank = rank;
        },
        
        samePosition : function (a, b) {
            return (a.x == b.x && a.y == b.y);
        }
    }
})();


var testFunctions = {
    Point : Point,
    
    // the movement function
    // the higher, the more expensive
    createMovementCostFunction : function createMovementCostFunction(matrix) {
        return function anon_funcMovementCost(f, t) {
            // "dark" is expensive
            // moving in a straight line is cheaper than moving diagonally
            return (f.x == t.x || f.y == t.y) 
                ? 1-matrix[t.y][t.x]
                : (1-matrix[t.y][t.x]) * 1.4142135;       // 1.4142135 aka sqrt(2)
        }
    },

    // returns all the neighbors of the current pt
    createGetNeighborsFunction : function createGetNeighborsFunction(matrix) {
        return function anon_funcGetNeighbors(pt) {
            var n = [], 
                c = [[-1,-1], [0,-1], [+1,-1], 
                     [-1, 0],         [+1, 0], 
                     [-1,+1], [0,+1], [+1,+1]];
            
            for (var i=0; i<c.length; i++) {
                var nx = pt.x-c[i][0],
                    ny = pt.y-c[i][1];

                // if neighbor is 0, it's impassable
                if (matrix[ny][nx] != 0)
                    n.push(new Point.Point(nx, ny, pt));
            }

            return n;
        }
    },

    // creates an heuristic function
    createHeuristicFunction : function createHeuristicFunction(mod) {
        var D = 1, 
            D2 = 1.4142135;

        return function anon_funcHeuristic(s, d) {
            var h_diagonal = Math.min(Math.abs(s.x-d.x), Math.abs(s.y-d.y));
            var h_straight = (Math.abs(s.x-d.x) + Math.abs(s.y-d.y));
            var h          = D2 * h_diagonal + D * (h_straight - 2 * h_diagonal);

            return h * mod;
        }
    }
}
