class Tools {
    
    constructor(){
        
    }
  ///mine
 compute2DPolygonCentroid(vertices: any)
 {
     let centroid = {x:0,y:0};
     let signedArea = 0.0;
     let x0;
     let y0 = 0.0; // Current vertex Y
     let x1 = 0.0; // Next vertex X
     let y1 = 0.0; // Next vertex Y
     let a = 0.0;  // Partial signed area
 
     // For all vertices except last
     let i=0;
     for (i=0; i<vertices.length-1; ++i)
     {
         x0 = vertices[i][0];
         y0 = vertices[i][1];
         x1 = vertices[i+1][0];
         y1 = vertices[i+1][1];
         a = x0*y1 - x1*y0;
         signedArea += a;
         centroid.x += (x0 + x1)*a;
         centroid.y += (y0 + y1)*a;
     }
 
     // Do last vertex separately to avoid performing an expensive
     // modulus operation in each iteration.
     x0 = vertices[i][0];
     y0 = vertices[i][1];
     x1 = vertices[0][0];
     y1 = vertices[0][1];
     a = x0*y1 - x1*y0;
     signedArea += a;
     centroid.x += (x0 + x1)*a;
     centroid.y += (y0 + y1)*a;
 
     signedArea *= 0.5;
     centroid.x /= (6.0*signedArea);
     centroid.y /= (6.0*signedArea);
 
 
     return centroid;
 }
  compute2DPolygonCentroidDebug(vertices: any)
 {
 
 //  d="M257.14019840439454,80.91414836764234,277.13783911526855,78.7863751605477,290.5607718784939,56.565704038297,276.5190505577433,37.259487235030086,247.43348855899947,39.1178384237785,246.77060548288318,39.71569224813706z"
     let centroid = {x:0,y:0};
     let signedArea = 0.0;
     let x0;
     let y0 = 0.0; // Current vertex Y
     let x1 = 0.0; // Next vertex X
     let y1 = 0.0; // Next vertex Y
     let a = 0.0;  // Partial signed area
 
     // For all vertices except last
     let i=0;
     for (i=0; i<vertices.length-1; ++i)
     {
         let x0 = vertices[i][0];
         y0 = vertices[i][1];
         x1 = vertices[i+1][0];
         y1 = vertices[i+1][1];
         a = x0*y1 - x1*y0;
         signedArea += a;
         centroid.x += (x0 + x1)*a;
         centroid.y += (y0 + y1)*a;
     }
 
     // Do last vertex separately to avoid performing an expensive
     // modulus operation in each iteration.
     x0 = vertices[i][0];
     y0 = vertices[i][1];
     x1 = vertices[0][0];
     y1 = vertices[0][1];
     a = x0*y1 - x1*y0;
     signedArea += a;
     centroid.x += (x0 + x1)*a;
     centroid.y += (y0 + y1)*a;
 
     signedArea *= 0.5;
     centroid.x /= (6.0*signedArea);
     centroid.y /= (6.0*signedArea);
 
     return centroid;
 }
 // Return a list of imports for the given array of nodes.
packageImports(nodes: any) {
    var map : any = {};
    let imports :any = [];

    // Compute a map from name to node.
    nodes.forEach(function(d: any) {
        map[d.data.name] = d;
    });

// For each import, construct a link from the source to target node.
    nodes.forEach(function(d: any) {
    if (d.data.ilinks) 
    d.data.ilinks.forEach(function(i: any) {
        imports.push(map[d.data.name].path(map[i]));
    });
    });

    return imports;
}

        // Lazily construct the package hierarchy from class names.
    packageHierarchy(classes: any) {
    var map:any  = {};
    
        function find(name: any, data?: any) {
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
        classes.forEach(function(d: any) {
            find(d.name, d);
        });
    
        return d3.hierarchy(map[""]);
    }
}