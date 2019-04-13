/*
Title: "A 'School' Look At Data"
Group: Chianne Connelly (), Melanie Hall (903112239), and Wheezy Menk ()
CS 4460: P5
Dataset: 'colleges.csv' 
*/

var width =500;
var height= 500;

d3.csv('./data/colleges.csv', function(error, dataset) {
	console.log(dataset[0])
    var svgLines = d3.select('svg');

    var margin = {top:50, bottom:50, left:30, right:30};

    var name = d3.nest()
    	.key(function(d) { return d.Name})
    	.entries(dataset);

    var control = d3.nest()
    	.key(function(d) { return d.Control})
    	.entries(dataset);

    var region = d3.nest()
    	.key(function(d) { return d.Region})
    	.entries(dataset);

    var act = d3.nest()
    	.key(function(d) { return d.ACTMed})
    	.entries(dataset);

    var sat = d3.nest()
    	.key(function(d) { return d.SATAverage})
    	.entries(dataset);			

    var avgCost = d3.nest()
    	.key(function(d) { return d.AverageCost})
    	.entries(dataset);

    var debt = d3.nest()
    	.key(function(d) { return d.Debt})
    	.entries(dataset);	

    var retenRate = d3.nest()
    	.key(function(d) { return d.RetentionRate})
    	.entries(dataset);

    var mean8 = d3.nest()
    	.key(function(d) { return d.Mean8})
    	.entries(dataset);	



    //Value Scales
    var yACT = d3.scaleLinear()
    	.domain([0, d3.max(act)])	

    var yAxisACT = d3.axisLeft().scale(yACT)	

    svgLines.append('g')
    	.attr("class", "y-axis")
    	.call(yAxisACT)
    	.attr("transform", "translate(120,0)");

})    	



