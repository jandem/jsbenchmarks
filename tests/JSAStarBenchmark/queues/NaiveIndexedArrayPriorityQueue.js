/*
    Notes:
        * using array.splice in removeNode is not faster, but *a lot* slower!
        * it's an awful data structure. go splay trees!
*/

function NaiveIndexedArrayPriorityQueue(
    _funcCmpNodeRanks, 
    _funcNodeGetCost, 
    _funcNodeSetCost, 
    _funcNodeGetRank, 
    _funcNodeSetRank, 
    _funcSamePosition) {

    var 
        nodes    = [],
        nodesPos = [];

    this.benchmark = new Counter();

    var setToPosition = function (id, node) {
        nodesPos[id] = node;
    }

    var getFromPosition = function (id) {
        return nodesPos[id];
    }

    // return the node with the same position 
    // i.e. coordinates, not position in the queue
    this.getNodeByPosition = function (node) {
        // this.benchmark.count('getNodeByPosition');
        return getFromPosition(node.getPosId());
    }

    // add new node to the queue
    this.add = function (node) {
        setToPosition(node.getPosId(), node);
        // this.benchmark.count('add');
        nodes.push(node);
    }

    // removes node from queue
    this.removeNode = function (node) {
        setToPosition(node.getPosId(), null);
        // this.benchmark.count('removeNode');
        var nnodes = [];

        for (var i=0; i<nodes.length; i++)
            if (nodes[i] !== node) {
                nnodes.push(nodes[i]);
            }

        nodes = nnodes;
    }

    // finds node with lowest rank, removes it from the queue and returns it
    this.removeBestRankedNode = function () {
        // this.benchmark.count('removeBestRankedNode');
        var bestRanked = nodes[0];

        for (var i=1; i<nodes.length; i++)
            if (_funcCmpNodeRanks(nodes[i], bestRanked))
                bestRanked = nodes[i];

        this.removeNode(bestRanked);

        return bestRanked;
    }

    // finds node with lowest rank
    this.findBestRankedNode = function() {
        // this.benchmark.count('findBestRankedNode');
        var bestRanked    = nodes[0];

        for (var i=1; i<nodes.length; i++)
            if (_funcCmpNodeRanks(nodes[i], bestRanked))
                bestRanked = nodes[i];

        return bestRanked;
    }


    // string rep for debugging
    this.toString = function () {
        var rep = [];
        
        for (var i=0; i<nodes.length; i++)
            rep.push(nodes[i]);

        return 'PQ: ' + rep.join(', ');
    }

    // returns the nodes
    this.getNodeArray = function () {
        return nodes;
    }
}
