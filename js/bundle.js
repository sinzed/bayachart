


    function mouseovered(d) {
        node
        .each(function(n) { n.target = n.source = false; });

        link
        .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
        .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
        .filter(function(l) { return l.target === d || l.source === d; })
        .raise();

        node
        .classed("node--target", function(n) { return n.target; })
        .classed("node--source", function(n) { return n.source; });
    }

    function mouseouted(d) {
    link
    .classed("link--target", false)
    .classed("link--source", false);

    node
    .classed("node--target", false)
    .classed("node--source", false);
    }

    // Lazily construct the package hierarchy from class names.
    function packageHierarchy(classes) {
    var map = {};

    function find(name, data) {
        var node = map[name], i;
        if (!node) {
          node = map[name] = data || {name: name, children: []};
          if (name.length) {
              node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
              node.parent.children.push(node);
              // if(node.members)
              //     packageHierarchy(node.members);
              // node.key = name.substring(i + 1);
          }
        }
        return node;
    }
    // for( let index in classes){
    //   console.log(index);
    //   if(index == "children")
    //     find(classes[index].name,classes[index]);
    // }
    classes.forEach(function(d) {
      find(d.name, d);
    });

    return d3.hierarchy(map[""]);
}

// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
var map = {},
  imports = [];

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.data.name] = d;
  });

// For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.data.imports) 
    d.data.imports.forEach(function(i) {
      imports.push(map[d.data.name].path(map[i]));
    });
  });

  return imports;
}