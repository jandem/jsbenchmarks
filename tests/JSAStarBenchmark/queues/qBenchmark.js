function Counter() {
    var counts = {};

    this.count = function (name) {
        var type = typeof counts[name];

        if (type == 'undefined')
            counts[name] = 1;
        else 
            counts[name] += 1;
    }

    this.toString = function() {
        var out = [];

        for (var name in counts)
            out.push(name + ' = ' + counts[name]);

        return out.join('\n');
    }
};
