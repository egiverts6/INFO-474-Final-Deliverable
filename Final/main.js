// **** Seting the dimensions and margins of the graph ****
var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// **** Appending the svg object to the body of the page ****
var svg = d3.select("#main")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");



d3.csv("./KNYC (1).csv").then(function(data) {

  // **** Code for creating scales, axes and labels ****
  var yearScale = d3.scaleLinear()
      .domain([1,12])
      .range([60,700]);

  var hrScale = d3.scaleLinear()
    .domain([0,120]).range([340,20]);

  var z = d3.scaleLinear()
    .domain([0, 17])
    .range([ 4, 3000]);

  var myColor = d3.scaleOrdinal()
    .domain(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"])
    .range(d3.schemeSet2);

  var svg = d3.select('svg');
  
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,345)')
    .call(d3.axisBottom(yearScale).tickFormat(function(d){
      return months[d - 1]}));

    svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(360,390)')
    .text('Month')
    .style('font-size', '15px');

    svg.append('g').attr('class', 'y axis')
        .attr('transform', 'translate(55,0)')
        .call(d3.axisLeft(hrScale));

    svg.append('text')
        .attr('class', 'label')
        .attr('transform','translate(17,250) rotate(-90)')
        .text('Temperature (˚F)')
        .style('font-size', '15px');

    svg.append('text')
        .attr('class', 'title')
        .attr('transform','translate(230,30)')
        .text("New York City's Weather: July 2014 - July 2015");

    // **** Code for creating the legend ****
    svg.append("circle")
        .attr("cx",630)
        .attr("cy",50)
        .attr("r", 6)
        .style('opacity', 0.75)
        .style("fill", "#696969")

    svg.append("circle")
        .attr("cx",630)
        .attr("cy",70)
        .attr("r", 6)
        .style('opacity', 0.75)
        .style("fill", "#8C0200")

    svg.append("circle")
        .attr("cx",630)
        .attr("cy",90)
        .attr("r", 6)
        .style('opacity', 0.75)
        .style("fill", "#F2898F")

    svg.append("circle")
        .attr("cx",630)
        .attr("cy",110)
        .attr("r", 6)
        .style("border-radius", "10%")
        .style("border", "0.5px solid black")

    svg.append("text")
        .attr("x", 640)
        .attr("y", 50)
        .text("Average Min Temp")
        .style("font-size", "10px")
        .attr("alignment-baseline","middle")

    svg.append("text")
        .attr("x", 640)
        .attr("y", 70)
        .text("Average Actual Temp")
        .style("font-size", "10px")
        .attr("alignment-baseline","middle")

    svg.append("text")
        .attr("x", 640)
        .attr("y", 90)
        .text("Average Max Temp")
        .style("font-size", "10px")
        .attr("alignment-baseline","middle")

    svg.append("text")
        .attr("x", 670)
        .attr("y", 30)
        .text("Key")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr("alignment-baseline","middle")

    svg.append("text")
        .attr("x", 640)
        .attr("y", 110)
        .text("Circle Size: Precipitation")
        .style("font-size", "10px")
        .attr("alignment-baseline","middle")




// **** Functions to call for scaled values ****

function scaleYear(year) {
  return yearScale(year);
}

function scaleHomeruns(homeruns) {
  return hrScale(homeruns);
}


function splitString(stringToSplit) {
  return stringToSplit.split("-")
}



//  **** Aggregation functions ****
function aggregated_min(d){
  aggregate_temp3 = {};
  aggregate_precip3 = {};
  counter = 0
  for (row in d) {
    if (counter < 365){
      row_date = d[row].date
      var splits = splitString(row_date)
      month = splits[1]
      if (!aggregate_temp3[month]) {
        aggregate_temp3[month] = [];
        aggregate_precip3[month] = [];
      }
      aggregate_temp3[month].push(d[row].average_min_temp)
      aggregate_precip3[month].push(d[row].average_precipitation)
      counter+=1
    }
  }
  output = []
  for (i in aggregate_temp3){
    temp_dict = {}
    temp_dict["month"] = i
    temp_dict["temp_mean"] = d3.mean(aggregate_temp3[i])
    temp_dict["temp_precip"] = d3.min(aggregate_precip3[i])
    output.push(temp_dict)
  }

  return output;
  }
  ag3 = aggregated_min(data)


  //  **** Tooltip ****
  var tooltip = d3.select("#main")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

  //  **** Tooltip to show/update/hide ****
  var showTooltip = function(d) {
  tooltip
    .transition()
    .duration(200)
  tooltip
    .style("opacity", 1)
    .html("Ave Min Temp: " + parseFloat(d.temp_mean).toFixed(2) + " | Min Precipitation: " + parseFloat(d.temp_precip).toFixed(2))
    .style("left", (d3.mouse(this)[0]+30) + "px")
    .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var moveTooltip = function(d) {
  tooltip
    .style("left", (d3.mouse(this)[0]+30) + "px")
    .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var hideTooltip = function(d) {
  tooltip
    .transition()
    .duration(200)
    .style("opacity", 0)
  }

  // **** Dots Code ****
  var bubbles3 = svg.append('g')
        .selectAll("dots")
        .data(ag3)
        .enter()
        .append("circle")
        .attr("cx", function(d){
          return scaleYear(d.month)})
        .attr("cy", function(d){
          return scaleHomeruns(d.temp_mean)})
        .attr("r", function(d){
          return z(d.temp_precip)})
        .style('fill', "#696969")
        .style('opacity', .75)
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )


        function aggregated_max(d){
          aggregate_temp2 = {};
          aggregate_precip2 = {};
          counter = 0
          for (row in d) {
            if (counter < 365){
              row_date = d[row].date
              var splits = splitString(row_date)
              month = splits[1]
              if (!aggregate_temp2[month]) {
                aggregate_temp2[month] = [];
                aggregate_precip2[month] = [];
              }
              aggregate_temp2[month].push(d[row].average_max_temp)
              aggregate_precip2[month].push(d[row].average_precipitation)
              counter+=1
            }
          }
          output = []
          for (i in aggregate_temp2){
            temp_dict = {}
            temp_dict["month"] = i
            temp_dict["temp_mean"] = d3.mean(aggregate_temp2[i])
            temp_dict["temp_precip"] = d3.max(aggregate_precip2[i])
            output.push(temp_dict)
          }
          return output;
        }
        ag2 = aggregated_max(data)
        
var tooltip = d3.select("#main")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "black")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("color", "white")

var showTooltip = function(d) {
tooltip
  .transition()
  .duration(200)
tooltip
  .style("opacity", 1)
  .html("Ave Max Temp: " + parseFloat(d.temp_mean).toFixed(2) + " | Max Precipitation: " + parseFloat(d.temp_precip).toFixed(2))
  .style("left", (d3.mouse(this)[0]+30) + "px")
  .style("top", (d3.mouse(this)[1]+30) + "px")
}
var moveTooltip = function(d) {
tooltip
  .style("left", (d3.mouse(this)[0]+30) + "px")
  .style("top", (d3.mouse(this)[1]+30) + "px")
}
var hideTooltip = function(d) {
tooltip
  .transition()
  .duration(200)
  .style("opacity", 0)
}
        
        var bubbles2 = svg.append('g')
                .selectAll("dots")
                .data(ag2)
                .enter()
                .append("circle")
                .attr("cx", function(d){
                  return scaleYear(d.month)})
                .attr("cy", function(d){
                  return scaleHomeruns(d.temp_mean)})
                .attr("r", function(d){
                  return z(d.temp_precip)})
                .style('fill', "#F2898F")
                .style('opacity', .75)
                .on("mouseover", showTooltip )
                .on("mousemove", moveTooltip )
                .on("mouseleave", hideTooltip )

function aggregated_ave(d){
  aggregate_temp = {};
  aggregate_precip = {};
  counter = 0
  for (row in d) {
    if (counter < 365){
      row_date = d[row].date
      var splits = splitString(row_date)
      month = splits[1]
      if (!aggregate_temp[month]) {
        aggregate_temp[month] = [];
        aggregate_precip[month] = [];
      }
      aggregate_temp[month].push(d[row].actual_mean_temp)
      aggregate_precip[month].push(d[row].average_precipitation)
      counter+=1
    }
  }
  output = []
  for (i in aggregate_temp){
    temp_dict = {}
    temp_dict["month"] = i
    temp_dict["temp_mean"] = d3.mean(aggregate_temp[i])
    temp_dict["temp_precip"] = d3.mean(aggregate_precip[i])
    output.push(temp_dict)
  }
  return output;
}
ag = aggregated_ave(data)


var tooltip = d3.select("#main")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "black")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("color", "white")

var showTooltip = function(d) {
tooltip
  .transition()
  .duration(200)
tooltip
  .style("opacity", 1)
  .html("Ave Temp: " + parseFloat(d.temp_mean).toFixed(2) + " | Ave Precipitation: " + parseFloat(d.temp_precip).toFixed(2))
  .style("left", (d3.mouse(this)[0]+30) + "px")
  .style("top", (d3.mouse(this)[1]+30) + "px")
}
var moveTooltip = function(d) {
tooltip
  .style("left", (d3.mouse(this)[0]+30) + "px")
  .style("top", (d3.mouse(this)[1]+30) + "px")
}
var hideTooltip = function(d) {
tooltip
  .transition()
  .duration(200)
  .style("opacity", 0)
}


var bubbles1 = svg.append('g')
        .selectAll("dots")
        .data(ag)
        .enter()
        .append("circle")
        .attr("cx", function(d){
          return scaleYear(d.month)})
        .attr("cy", function(d){
          return scaleHomeruns(d.temp_mean)})
        .attr("r", function(d){
          return z(d.temp_precip)})
        .style('fill', "#8C0200")
        .style('opacity', .75)
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )

        })




