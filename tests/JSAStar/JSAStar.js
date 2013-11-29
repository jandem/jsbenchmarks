/*
  JSA*-Pathfinder
  
  A JavaScript implementation of the A* pathfinder, after the 
  pseudocode provided by Amit's Game Programming pages
  (http://theory.stanford.edu/~amitp/GameProgramming/ImplementationNotes.html)
  
  Usage:
  
  p = new JSAStar(_start, _destination, _funcHeuristic, _funcMovementCosts, _funcGetNeighbors, ... moar):
  
  where ...
  
  _start and _destination: 
    node objects

  _queue:
    the queue object function thats to be used
    
  _funcHeuristic:
    a function that takes two node objects and returns an distance estimae
    
  _funcMovementCosts:
    a function that takes two adjacent nodes and returns the cost of moving from 
    node A to node B
    
  _funcGetNeighbors:
    a function that takes a node and returns all the directly adjacent neighbors of
    this node
    
  _funcGetRank, _funcGetCost
    functions that take nodes and return their respective ranks or costs

  _funcGetRank, _funcGetCost
    functions that take a node and a rank/cost value and set them
    
  returns an pathfinder object.
  
  then call x = p.iterate()
  - if x is null, then there is no solution yet (call iterate() again)
  - if x is a node object, then a solution was found
  - if an exception is thrown, there is no path
  
  Node Objects
  ------------
  you can pass any objects as node objects, they just need to implement
  a) a reference their parent node (or null), 
  b) a cost attribute that stores the costs, and
  b) a rank attribute, that the funcCmpNodes function may operate on
*/

function JSAStar(   _start, 
                    _destination,
                    _queue,
                    _funcHeuristic, 
                    _funcMovementCosts, 
                    _funcGetNeighbors, 

                    _funcCmpNodeRanks, 
                    _funcNodeGetCost, 
                    _funcNodeSetCost, 
                    _funcNodeGetRank, 
                    _funcNodeSetRank, 
                    _funcSamePosition) {

    this.iterationCount = 0;
        
    this.qOpen   = new _queue(_funcCmpNodeRanks, _funcNodeGetCost, _funcNodeSetCost, _funcNodeGetRank, _funcNodeSetRank, _funcSamePosition);
    this.qClosed = new _queue(_funcCmpNodeRanks, _funcNodeGetCost, _funcNodeSetCost, _funcNodeGetRank, _funcNodeSetRank, _funcSamePosition);

    this.qOpen.add(_start);

    this.getBestPartialPath = function () {
        return this.qOpen.findBestRankedNode();
    }
    
    // one step
    this.iterate = function() {
        this.iterationCount += 1;

        // current = remove lowest rank item from OPEN
        // add current to CLOSED
        var current = this.qOpen.removeBestRankedNode();

        if (current) {
            // found!
            if (_funcSamePosition(current, _destination))
                return current;

            this.qClosed.add(current);

            var neighbors = _funcGetNeighbors(current);

            for (var i=0; i<neighbors.length; i++) {
                var nb   = neighbors[i];

                // cost = g(current) + movementcost(current, neighbor)
                var nmvc = _funcMovementCosts(current, nb);

                // path is blocked, so continue
                var cost = _funcNodeGetCost(current) + nmvc;


                // if neighbor in OPEN and cost less than g(neighbor):
                // remove neighbor from OPEN, because new path is better
                var aoNb = this.qOpen.getNodeByPosition(nb);
                if (aoNb && cost < _funcNodeGetCost(aoNb)) {
                    this.qOpen.removeNode(aoNb);
                }

                // if neighbor in CLOSED and cost less than g(neighbor): **
                //   remove neighbor from CLOSED
                var acNb = this.qClosed.getNodeByPosition(nb);
                if (acNb && cost < _funcNodeGetCost(acNb)) {
                    this.qClosed.removeNode(acNb);
                }
                
                // if neighbor not in OPEN and neighbor not in CLOSED:
                //   set g(neighbor) to cost
                //   add neighbor to OPEN
                //   set priority queue rank to g(neighbor) + h(neighbor)
                //   set neighbor's parent to current
                var aoNb = this.qOpen.getNodeByPosition(nb);
                var acNb = this.qClosed.getNodeByPosition(nb);
                if (!aoNb && !acNb) {
                    _funcNodeSetCost(nb, cost);
                    _funcNodeSetRank(nb, cost + _funcHeuristic(nb, _destination));
                    this.qOpen.add(nb);
                }
            }
        } else {
            // no nodes in qOpen  left,
            // meaning there is no path
            throw "No path found";
        }

        // no solution found this iteration ... 
        // maybe next time
        return null;
    }
}
