var width = 500;
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
var isInitGlobe = false;

function init() {
  initBackground();
  initWeather();
}


function initGlobe() {
    // d3.json("https://raw.githubusercontent.com/infographicstw/example/gh-pages/352/world.json", function(world) {

    projection = d3.geo.orthographic().scale(50).translate([200, 100]).clipAngle(90);
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
        .attr("transform", "translate(" + 0 + "," + 0 + ")");

    map.append("path")
        .datum(grid)
        .attr("id", "grid_id")
        .attr("style", "stroke: gray;stroke-width: 1;fill:none;opacity: 1;")
        .attr("d", path);

    map.selectAll(".map_path")
        .data(countries)
        .enter()
        .append("path")
        // .attr("class","map_path")
        // .attr("fill",function(d,i){
        //  return color(i);
        // })
        .attr("d", path);


    // var peking = [116.3, 39.9];
    // var proPeking = projection(peking);

    // svg.append("circle")
    //     .attr("fill","red")
    //     .attr("cx",proPeking[0])
    //     .attr("cy",proPeking[1])
    //     .attr("r",8);
    projection.center(proPeking);

    // rotate(116.3, 39.9);

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
}


function rotate(a, b) {
    if(!isInitGlobe) {
      initGlobe();
    }

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
    }).each("end", function() {
        proPeking = projection(peking);
        svg.selectAll("circle").attr("r", 0);
        svg.append("circle")
            .attr("fill", "blue")
            .attr("cx", proPeking[0])
            .attr("cy", proPeking[1])
            .attr("r", 2);
    })
}

function initBackground() {
    $.get("http://104.236.40.145:9090/getBackground", function(res) {
        document.getElementById("background").style.backgroundImage = "url(\"" + res.data + "\")";
        rotate(res.b, res.a);

    });
}

function initWeather() {
    $.get("http://104.236.40.145:9090/getWeather", function(res) {
        var weatherObj = {
            code: 'C',
            condition: res.item.condition.text,
            temperature: fahrenheit2Celsius(res.item.condition.temp),
            unitClass: "hide",
            unit: 'c',
            location: location.city,
            forecast: [

            ],
            astronomy: {
                sunrise: res.astronomy.sunrise,
                sunset: res.astronomy.sunset
            },
            detail: {
                visibility: res.atmosphere.visibility,
                humidity: res.atmosphere.humidity,
                pressure: res.atmosphere.pressure,
                wind: res.wind.speed,

            },
            hasAqi: true,
            aqiPermission: true,
            aqi: res.aqi.aqi,
            aqiCategory: getAQICategory(res.aqi.aqi)

        };

        for (var i = 0; i < res.item.forecast.length; i++) {
            weatherObj.forecast[i] = {
                day: res.item.forecast[i].day,
                date: res.item.forecast[i].date,
                code: fahrenheit2Celsius(res.item.forecast[i].code),
                text: res.item.forecast[i].text,
                high: fahrenheit2Celsius(res.item.forecast[i].high),
                low: fahrenheit2Celsius(res.item.forecast[i].low)
            }
        }

        var source = $("#weather-template").html();
        var template = Handlebars.compile(source);
        var html = template(weatherObj);
        $("#weather").html(html);


        getSunPosition(res.astronomy.sunrise, res.astronomy.sunset);

        // c();

        var sa = document.getElementById("sun-animation");
        sa.style.width = "100%";
        var ssp = document.getElementById("sun-symbol-path");
        $("#sun-symbol-path").css("-webkit-transform", "rotateZ(75deg)");
    });
}

function fahrenheit2Celsius(temp) {
    return parseInt((temp - 32) / 1.8);
}

function getAQICategory(aqi) {
    var aqiObj = {};

    switch (true) {
        case aqi <= 50:
            aqiObj.aqiCategory = "Good";
            aqiObj.aqiColor = "#009966";
            break;
        case aqi > 50 && aqi <= 100:
            aqiObj.aqiCategory = "Moderate";
            aqiObj.aqiColor = "#ffde33";
            break;
        case aqi > 101 && aqi <= 150:
            aqiObj.aqiCategory = "Unhealthy for Sensitive Groups";
            aqiObj.aqiColor = "#ff9933";
            break;
        case aqi > 151 && aqi <= 200:
            aqiObj.aqiCategory = "Unhealthy";
            aqiObj.aqiColor = "#cc0033";
            break;
        case aqi > 201 && aqi <= 300:
            aqiObj.aqiCategory = "Very Unhealthy";
            aqiObj.aqiColor = "#660099";
            break;
        default:
            aqiObj.aqiCategory = "Hazardous";
            aqiObj.aqiColor = "#7e0023";
            break;


    }
}

function parseTime(a) {
    console.log(a);
    var b = new Date;
    var c = a.match(/(\d+)(?::(\d{1,2}))?\s*(p?)/);

    console.log(c[1] + ", " + c[2] + ", " + c[3]);
    return b.setHours(parseInt(c[1]) + (c[3] ? 12 : 0)), b.setMinutes(parseInt(c[2]) || 0), b
}

function getSunPosition(start, end) {
    var startTime = parseTime(start);
    var endTime = parseTime(end);
    var now = new Date;

    console.log("start time:" + startTime);
    console.log("end time :" + endTime);
    console.log("now:" + now);
    // cosole.log("now - start:" + (now - startTime));
    sunPosition = Math.abs(now - startTime) / Math.abs(endTime - startTime);
    console.log("sun position:" + sunPosition);
}

function rePaintSunAnimation() {
    $("#sun-animation").css("width", Math.floor(100 * sunPosition) + "%"), $("#sun-symbol-path").css("-webkit-transform", "rotateZ(" + (150 * sunPosition - 75) + "deg)")
}

function resetSunAnimation() {
    $("#sun-animation").css("width", "0%"), $("#sun-symbol-path").css("-webkit-transform", "rotateZ(-75deg)");
}

function aaa() {
    // console.log("aaa")
    $("#weather-detail").toggleClass("is-visible");
    rePaintSunAnimation();
}
function bbb() {
    // console.log("bbb")
    $("#weather-detail").toggleClass("is-visible");
    resetSunAnimation();
}