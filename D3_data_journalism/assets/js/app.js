// SVG wrapper dimensions
var svgWidth = 800;
var svgHeight = 600;

var margin = {
  top: 50,
  right: 50,
  bottom: 0,
  left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// append svg and group
var svg = d3.select("#scatter")
  .append("svg")
  .attr("viewBox", `0 0 700 700`)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// initial Params
var chosenXAxis = "smokes";
var chosenYAxis = "age";

// main function call
d3.csv("assets/data/data.csv").then(plotData);

// main function with csv passed in
function plotData(importData) 
{
  importData.map(function(data) 
  {
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
    .attr("r", "15")
    .attr("fill", "#1ba6c2")
    .attr("opacity", ".8")

  // append to graph
  var dataPoints = chartGroup.selectAll()
    .data(importData)
    .enter()
    .append("text")
    .attr("x", d => xScale(d.smokes))
    .attr("y", d => yScale(d.age))
    .style("font-size", "15px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

  // add tooltip info
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([70, -50])
    .html(function (d) 
    {
      return (`${d.state}<br>Median Age: ${d.age}<br>Smokers: ${d.smokes}% `);
    });
  chartGroup.call(toolTip);
  
  // mouseover
  dataPoints.on("mouseover", function(data) 
  {
    toolTip.show(data, this);
  })
  // mouseout
  .on("mouseout", function(data) 
  {
    toolTip.hide(data, this);
  });

  //add axis labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Age");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
    .attr("class", "axisText")
    .text("Smokers (%)");
}