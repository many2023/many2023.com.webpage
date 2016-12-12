var width  = 500;
var height = 440;
var speed = 0.02;
var startTime = Date.now();
var currentTime = Date.now();
var pre = 0;
var projection = null;
var path = null;
var countries = null;
var grid = null;
var color = null;
var svg = null;
var map = null;

// d3.json("https://raw.githubusercontent.com/infographicstw/example/gh-pages/352/world.json", function(world) {

  projection = d3.geo.orthographic().scale(50).translate([200,100]).clipAngle(90);
  path = d3.geo.path().projection(projection);
  countries = topojson.feature(world, world.objects.countries).features;
  color = d3.scale.category20();
  // console.log(countries);

  grid = d3.geo.graticule();
  
  // var polygon = d3.select("#svg").selectAll("path").data(countries)
  //   .enter().append("path").attr({"d":path});

  // d3.select("#svg").selectAll("path")

  // d3.select("#svg").call(d3.behavior.drag()
  //     .origin(function() {
  //       r = projection.rotate();
  //       return {x: r[0], y: -r[1]};
  //     })
  //     .on("drag", function() {
  //     rotate = projection.rotate();
  //     projection.rotate([d3.event.x, -d3.event.y, rotate[2]]);
  //     d3.select("#svg").selectAll("path").attr("d", path);
  //   }));



svg = d3.select("#svg")
map = svg.append("g")
           .attr("transform", "translate(" +  0 + "," + 0 + ")");
    
    map.append("path")
      .datum( grid )
      .attr("id","grid_id")
      .attr("style","stroke: gray;stroke-width: 1;fill:none;opacity: 1;")
      .attr("d",path);
    
    map.selectAll(".map_path")
        .data(countries)
        .enter()
        .append("path")
        // .attr("class","map_path")
        // .attr("fill",function(d,i){
        //  return color(i);
        // })
        .attr("d", path );


var peking = [116.3, 39.9];
var proPeking = projection(peking);
// svg.append("circle")
//     .attr("fill","red")
//     .attr("cx",proPeking[0])
//     .attr("cy",proPeking[1])
//     .attr("r",8);
projection.center(proPeking);

rotate(116.3, 39.9);
// (function transition() {
//   var peking = [116.3, 39.9];
//   var proPeking = projection(peking);
//   projection.center(peking);

//   d3.transition().duration(2500).
//   tween("rotate", function() {
//     var r = d3.interpolate(projection.rotate(), [-116.3, -15]);
//     return function(t) {
//       projection.rotate(r(t));
//       d3.select("#svg").selectAll("path").attr("d", path);
//     };
//   }).each("end", function(){
//     proPeking = projection(peking);
//     svg.selectAll("circle").attr("r", 0);
//         svg.append("circle")
//             .attr("fill","blue")
//             .attr("cx",proPeking[0])
//             .attr("cy",proPeking[1])
//             .attr("r",1);
//   })
// })();

  // d3.timer(function() {
      
  //     currentTime = Date.now();
  //     var peking = [116.3, 39.9];
  //     var proPeking = projection(peking);
  //     // projection.rotate([speed * (currentTime - startTime), -15]);
      
  //     rotate = projection.rotate();
  //     projection.rotate([speed * (currentTime - startTime), -15]);

  //     // console.log(speed * (currentTime - startTime))
  //     // map.select("#grid_id")
  //     //   .attr("d",path);
      
  //     d3.select("#svg").selectAll("path").attr("d", path);
      
  //     svg.selectAll("circle").attr("r", 0);
  //     if(proPeking[0] > pre){
  //       svg.selectAll("circle")
  //           .attr("fill","red")
  //           .attr("cx",proPeking[0])
  //           .attr("cy",proPeking[1])
  //           .attr("r",8);
  //     }
  //     pre = proPeking[0];
      
  //     // console.log(projection.centroid());
  //   });
// });



function rotate(a, b) {
  var peking = [a, b];
  var proPeking = projection(peking);
  projection.center(peking);

  d3.transition().duration(2500).
  tween("rotate", function() {
    var r = d3.interpolate(projection.rotate(), [-a, -15]);
    return function(t) {
      projection.rotate(r(t));
      d3.select("#svg").selectAll("path").attr("d", path);
    };
  }).each("end", function(){
    proPeking = projection(peking);
    svg.selectAll("circle").attr("r", 0);
        svg.append("circle")
            .attr("fill","blue")
            .attr("cx",proPeking[0])
            .attr("cy",proPeking[1])
            .attr("r",2);
  })
}

