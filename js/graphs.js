var thirdWidth = document.getElementById("graph-win-loss").offsetWidth - 100,
    thirdHeight = thirdWidth,
    thickness = 20,
    thirdRadius= Math.min(thirdWidth, thirdHeight) / 2;
var arc = d3.svg.arc()
    .innerRadius(thirdRadius - thickness)
    .outerRadius(thirdRadius);
var colour = d3.scale.category10();

function drawAvgScore(score){
    document.getElementById("avg-score").innerHTML = score;
}

function drawPlacing(placement){
    document.getElementById("placing").innerHTML = placement;
}

function drawStreak(streak){
    document.getElementById("top-streak").innerHTML = streak;
}

function drawWinLossDetail(title, div, data){
    document.getElementById(title).innerHTML = "Win to loss history";
    drawDetailBar(div, data, "year", "win");
}
function drawHomeWinLossDetail(title, div, data){
    document.getElementById(title).innerHTML = "Home win to loss history";
    drawDetailBar(div, data, "year", "win");
}
function drawAwayWinLossDetail(title, div, data){
    document.getElementById(title).innerHTML = "Away win to loss history";
    drawDetailBar(div, data, "year", "win");
}

var dataWinLoss = [];//pie, path, data, legend
function drawWinLoss(winPercentage){
        var data = [
        {label: "Win", num: winPercentage},
        {label: "Loss", num: 100-winPercentage}
    ];
    if(dataWinLoss.length>0){
        dataWinLoss[2] = data;
        changePie(dataWinLoss[0], dataWinLoss[1], dataWinLoss[2], dataWinLoss[3] );
        return;
    }
    drawPie("graph-win-loss", data, dataWinLoss);
}

var dataHomeWin = [];//pie, path, data, legend
function drawHomeWinPercentage(winPercentage){
    var data = [
        {label: "Win", num: winPercentage},
        {label: "Loss", num: 100-winPercentage}
    ];
    if(dataHomeWin.length>0){
        dataHomeWin[2] = data;
        changePie(dataHomeWin[0], dataHomeWin[1], dataHomeWin[2], dataHomeWin[3] );
        return;
    }
    drawPie("graph-home-wins", data, dataHomeWin);
}

var dataAway =[];
function drawAwayWinPercentage(winPercentage){
    var data = [
        {label: "Win", num: winPercentage},
        {label: "Loss", num: 100-winPercentage}
    ];
    if(dataAway.length>0){
        dataAway[2] = data;
        changePie(dataAway[0], dataAway[1], dataAway[2], dataAway[3] );
        return;
    }
    drawPie("graph-away-wins", data, dataAway);
}

var topFiveSVG;
function drawTopFiveVenues(venues){
    topFiveSVG = drawBar("graph-top-venues", venues, topFiveSVG, "venue", "percentage");
}
var rivalSVG;
function drawRivalTeams(data){
    rivalSVG = drawBar("graph-top-rivals", data, rivalSVG, "rival", "percentage");
}

var comparWinLossSVG;
function drawComparisonWinLoss(data){
    //data = data.map(function(d, i) {
    //    return {x: i, y: d.win};
    //});
    //data[0].team = "Melbourne Vixens";
    comparWinLossSVG = drawBar("graph-comp-win-loss", data, comparWinLossSVG, "team", "win", true);
    //drawStackedBar("graph-comp-win-loss", data, comparWinLossSVG, "team", "Win Percentage", ["win", "loss"]);
    //data.forEach(function(d) {
    //    var y0 = 0;
    //    d.win = colour.domain().map(function(obj) { return {name: obj.name, y0: y0, y1: y0 += +d[obj.name]}; });
    //    d.total = d.ages[d.ages.length - 1].y1;
    //});
}

var comparHomeWin;
function drawComparisonHomeWins(data){
    comparHomeWin = drawBar("graph-comp-home-wins", data, comparHomeWin, "team", "win", true);
}

var comparAwayWin;
function drawComparisonAwayWins(data){
    comparAwayWin= drawBar("graph-comp-away-wins", data, comparAwayWin, "team", "win", true);
}


function drawDetailBar(name, data, xKey, yKey){
    var fullMargin = {top: 20, right: 20, bottom: 30, left: 40},
        fullWidth = document.getElementById(name).offsetWidth - fullMargin.left - fullMargin.right,
        fullHeight = fullWidth/ 3 - fullMargin.top - fullMargin.bottom;

    var colour = d3.scale.category10();
    //var ymax = d3.max(data, function(d) { return + d[yKey];} );
    var ymax = 100;

    var yScale = d3.scale.linear()
        .domain([0, ymax])
        .range([fullHeight, 0]);

    var xScale = d3.scale.ordinal()
        .domain(data.map(function(d) { return d[xKey]; }))
        .rangeRoundBands([0, fullWidth], .3);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10);

    var svg = d3.select("#" + name)
        .append("svg")
        .attr("width", fullWidth + fullMargin.left + fullMargin.right)
        .attr("height", fullHeight + fullMargin.top + fullMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + fullMargin.left + "," + fullMargin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + fullHeight + ")")
        .call(xAxis)
        .text(xKey);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yKey);
    var bar = svg.selectAll(".bar")
        .data(data);
    bar.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) {
            return xScale(d[xKey]);
        })
        .attr("y", function(d){return yScale(d[yKey]);})
        .attr("height", function(d){ return fullHeight - yScale(d[yKey]);})
        .attr("width", xScale.rangeBand())
        .attr("fill", colour);

    svg.selectAll("g.x.axis")
        .call(xAxis);
}

function drawBar(name, data, svg, xKey, yKey, small){
    var fullMargin = {top: 20, right: 20, bottom: 30, left: 40},
        fullWidth = document.getElementById(name).offsetWidth - fullMargin.left - fullMargin.right,
        fullHeight = fullWidth/ 3 - fullMargin.top - fullMargin.bottom;
    if (small){
        fullHeight = fullWidth;
    }
    var colour = d3.scale.category10();
    //var ymax = d3.max(data, function(d) { return + d[yKey];} );
    var ymax = 100;

    var yScale = d3.scale.linear()
        .domain([0, ymax])
        .range([fullHeight, 0]);

    var xScale = d3.scale.ordinal()
        .domain(data.map(function(d) { return d[xKey]; }))
        .rangeRoundBands([0, fullWidth],.5);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10);

    if(svg!=null){
        changeBar();
        return svg;
    }

    svg = d3.select("#" + name)
        .append("svg")
        .attr("width", fullWidth + fullMargin.left + fullMargin.right)
        .attr("height", fullHeight + fullMargin.top + fullMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + fullMargin.left + "," + fullMargin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + fullHeight + ")")
        .call(xAxis)
        .text(xKey);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yKey);
    changeBar();

    function changeBar(){
        var bar = svg.selectAll(".bar")
            .data(data);
        bar.enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, i) {
                return xScale(d[xKey]);
            })
            .attr("y", function(d){return yScale(d[yKey]);})
            .attr("height", function(d){ return fullHeight - yScale(d[yKey]);})
            .attr("width", xScale.rangeBand())
            .attr("fill", colour);

        svg.selectAll("g.x.axis")
            .call(xAxis);
        //removed
        bar.exit().remove();
        //updated
        bar.transition().duration(500)
            .attr("x", function(d, i) {
                return xScale(d[xKey]);
            })
            .attr("y", function(d){return yScale(d[yKey]);})
            .attr("height", function(d){ return fullHeight - yScale(d[yKey]);})
            .attr("width", xScale.rangeBand());
    }
    return svg;
}



function drawPie(name, data, dataTuple){
    var svg = d3.select("#" + name)
        .append("svg")
        .attr("width", thirdWidth)
        .attr("height", thirdHeight)
        .append("g")
        .attr("transform", "translate(" + (thirdWidth / 2) +  "," + (thirdHeight / 2) + ")");

    var pie = d3.layout.pie()
        .value(function(d) { return d.num; })
        .sort(null);
    dataTuple[0] = pie;

    var path = svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function(d, i) {
            return colour(d.data.label);
        }).each(function(d) { this._current = d; });
    dataTuple[1] = path;
    dataTuple[2] = data;

    var legend = svg.selectAll(".pie-legend")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "pie-legend")
        .attr("x", 0)
        .attr("y", function(d, i){
            return i*20;
        })
        .attr("text-anchor", "middle")
        .attr("fill", function(d, i) {
            return colour(data[data.indexOf(d)].label);
        })
        .text(function(d){
            return data[data.indexOf(d)].label + " " + data[data.indexOf(d)].num + "%";
        });
    dataTuple[3] = legend;
}


function changePie(pie, path, data, legend) {
    path.data(pie(data));
    legend.data(data);
    legend
        .text(function(d){
            return data[data.indexOf(d)].label + " " + data[data.indexOf(d)].num + "%";
        });
    path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
}

function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    };
}