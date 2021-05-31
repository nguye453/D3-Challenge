// SVG wrapper dimensions
var svgWidth = 800;
var svgHeight = 600;

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// append svg and group
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// initial Params
var chosenXAxis = "smokes";
var chosenYAxis = "age";

// main function call
d3.csv("assets/data/data.csv").then(plotData);

// main function with csv passed in
function plotData(importData) {
  importData.map(function(data) {
    data.age = +data.age;
    data.smokes = +data.smokes;
  });

  // two functions to update scaling
  var xScale = d3.scaleLinear()
    .domain([8, d3.max(importData, d => d.smokes)])
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([30, d3.max(importData, d => d.age)])
    .range([height, 0]);

  // render axes
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

  // append axes to chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  chartGroup.append("g")
    .call(leftAxis);

  // render data points
  var dataPoints = chartGroup.selectAll("circle")
    .data(importData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.smokes))
    .attr("cy", d => yScale(d.age))
    .attr("r", "13")
    .attr("fill", "#1ba6c2")
    .attr("opacity", ".8")

  // append to graph
  var dataPoints = chartGroup.selectAll()
    .data(importData)
    .enter()
    .append("text")
    .attr("x", d => xScale(d.smokes))
    .attr("y", d => yScale(d.age))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

  // add tooltip info  
}