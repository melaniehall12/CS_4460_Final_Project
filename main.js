/*
Title: "A 'School' Look At Data"
Group: Chianne Connelly (), Melanie Hall (903112239), and Wheezy Menk ()
CS 4460: P5
Dataset: 'colleges.csv' 
*/

var width =500;
var height= 500;



// var yACT = d3.scaleLinear().range([0,height], 0.3);

// var yAxisACT = d3.axisLeft(yACT);

var yACT = d3.scaleLinear();
var ySAT = d3.scaleLinear();
var yCost = d3.scaleLinear();
var yDebt = d3.scaleLinear();
var yRR= d3.scaleLinear();
var yMean8 = d3.scaleLinear();

d3.csv('./data/colleges.csv', function(d) {
	
	d.ACTMed = +d.ACTMed;
	d.SATAcverage = +d.SATAverage;
	d.AverageCost = +d.AverageCost;
	d.Debt= +d.Debt;
	d.RetentionRate = +d.RetentionRate;
	d.Mean8 = +d.Mean8;
	// //console.log(d[1].ACTMed); 
	
	return d;
}, function(error, data){
	console.log(data[0]);
	yACT.domain([0, d3.max(data, function(d) {
		return d.ACTMed;
	})]);
	ySAT.domain([0, d3.max(data, function(d) {
		return d.SATAverage;
	})]);
	yCost.domain([0, d3.max(data, function(d) {
		return d.AverageCost;
	})]);
	yDebt.domain([0, d3.max(data, function(d) {
		return d.Debt;
	})]);
	yRR.domain([0, d3.max(data, function(d) {
		return d.RetentionRate;
	})]);
	yMean8.domain([0, d3.max(data, function(d) {
		return d.Mean8;
	})]);
 
});
	



//     var margin = {top:50, bottom:50, left:30, right:30};

//     var name = d3.nest()
//     	.key(function(d) { return d.Name})
//     	.entries(dataset);

//     var control = d3.nest()
//     	.key(function(d) { return d.Control})
//     	.entries(dataset);

//     var region = d3.nest()
//     	.key(function(d) { return d.Region})
//     	.entries(dataset);

//     var act = d3.nest()
//     	.key(function(d) { return d.ACTMed})
//     	.entries(dataset);
//     	console.log(act);

//     var sat = d3.nest()
//     	.key(function(d) { return d.SATAverage})
//     	.entries(dataset);			

//     var avgCost = d3.nest()
//     	.key(function(d) { return d.AverageCost})
//     	.entries(dataset);

//     var debt = d3.nest()
//     	.key(function(d) { return d.Debt})
//     	.entries(dataset);	

//     var retenRate = d3.nest()
//     	.key(function(d) { return d.RetentionRate})
//     	.entries(dataset);

//     var mean8 = d3.nest()
//     	.key(function(d) { return d.Mean8})
//     	.entries(dataset);	



//     //Value Scales
//     // var yACT = d3.scaleLinear()
//     // 	.domain([0, d3.max(act)])


var svg = d3.select('svg');

chart = svg.append('g');
    //.attr('transform', 'translate('+ [padding.left, padding.top] +')');


var yAxisACT = d3.axisLeft().scale(yACT);	
console.log(yAxisACT);

chart
        .append('g')
        .attr('class', 'y axis')
        .call(yAxisACT);

// svgRegion.selectAll('main')
// 	.append('g')
// 	.attr("class", "y axis")
// 	.call(yAxisACT)
// 	.append("text")
// 	.text("asfjda;kdfasfjlasjflsdfl");
	//.attr("transform", "translate(50,0)");

// });   	



