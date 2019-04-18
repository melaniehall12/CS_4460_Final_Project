//Final Project: "College Stats Across the U.S."
//CS 4460: P5
//Group: Chianne Connelly (903047323), Melanie Hall (903112239), and Wheezy Menk (903104394)
//Data: 'colleges.csv'

//Set heighth and width of charts:
var width = 600;
var height = 600;

//Global vars for adjusting brush with axis variable changes:
var changedX = 0; //Checks whether axis var has been changed.
var changedY = 0;
var changedX2 = 0;
var changedY2 = 0;
var axisValX;
var axisValY;
var axisValX2;
var axisValY2;

//Load in data:
d3.csv('./data/colleges.csv', function(csv) {
    for (var i = 0; i < csv.length; ++i) {
        csv[i].ACTMedian = Number(csv[i].ACTMedian);
        csv[i].SATAvg = Number(csv[i].SATAvg);
        csv[i].MedDebtGrad = Number(csv[i].MedDebtGrad);
        csv[i].MeanEarnAfter8 = Number(csv[i].MeanEarnAfter8);
        csv[i].AverageCost = Number(csv[i].AverageCost);
        csv[i].RetentionRate = Number(csv[i].RetentionRate);
        csv[i].AdmissionRate = Number(csv[i].AdmissionRate);
        csv[i].UndergradPop = Number(csv[i].UndergradPop);
        csv[i].MedDebtWithdraw = Number(csv[i].MedDebtWithdraw);
        csv[i].percentWhite = Number(csv[i].percentWhite);
        csv[i].percentBlack = Number(csv[i].percentBlack);
        csv[i].percentHispanic = Number(csv[i].percentHispanic);
        csv[i].percentAsian = Number(csv[i].percentAsian);
        csv[i].percentIndian = Number(csv[i].percentIndian);
        csv[i].percentIslander = Number(csv[i].percentIslander);
        csv[i].percentBiracial = Number(csv[i].percentBiracial);
        csv[i].percentAlien = Number(csv[i].percentAlien);
        csv[i].partTime = Number(csv[i].partTime);
        csv[i].Name = csv[i].Name;
        csv[i].Control = csv[i].Control;
        csv[i].Region = csv[i].Region;
        if (csv[i].Region == 'Southwest'){
          csv[i].RegionColor = '#900303';
        } else if (csv[i].Region == 'Rocky Mountains'){
          csv[i].RegionColor = '#905F03';
        } else if (csv[i].Region == 'Mid-Atlantic'){
          csv[i].RegionColor = '#327834';
        } else if (csv[i].Region == 'Great Lakes'){
          csv[i].RegionColor = '#E30808';
        } else if (csv[i].Region == 'Southeast'){
          csv[i].RegionColor = '#F8B205';
        } else if (csv[i].Region == 'New England'){
          csv[i].RegionColor = '#FFFB03'
        }  else if (csv[i].Region == 'Great Plains'){
          csv[i].RegionColor = '#FB9BBD';
        } else if (csv[i].Region == 'Far West'){
          csv[i].RegionColor = '#D6DDA7'
        } else if (csv[i].Region == 'Outlying Areas'){
          csv[i].RegionColor = '#F58C4C';
        } else {
          csv[i].RegionColor = '#000000';
        }


        csv[i].cy1 = 0;
        csv[i].cx1 = 0;
        csv[i].cy2 =0;
        csv[i].cx2 = 0

    }

    //Make extents:
    var ACTMedianExtent = d3.extent(csv, function(row) { return row.ACTMedian; });
    var SATAvgExtent = d3.extent(csv,  function(row) { return row.SATAvg;  });
    var MedDebtGradExtent = d3.extent(csv, function(row) { return row.MedDebtGrad; });
    var MeanEarnAfter8Extent = d3.extent(csv,  function(row) { return row.MeanEarnAfter8;  });
    var AverageCostExtent = d3.extent(csv,  function(row) { return row.AverageCost;  });
    var RetentionRateExtent = d3.extent(csv,  function(row) { return row.RetentionRate;  });
    var AdmissionRateExtent = d3.extent(csv,  function(row) { return row.AdmissionRate;  });
    var UndergradPopExtent = d3.extent(csv,  function(row) { return row.UndergradPop;  });
    var MedDebtWithdrawExtent = d3.extent(csv,  function(row) { return row.MedDebtWithdraw;  });

    //Axis setup:
    var xScale = d3.scaleLinear()
      .domain([
      d3.min([0,d3.min(csv,function (d) { return d['ACTMedian'] })]),
      d3.max([0,d3.max(csv,function (d) { return d['ACTMedian'] })])
      ])
    .range([50, 570])

    var yScale = d3.scaleLinear()
      .domain([
      d3.min([0,d3.min(csv,function (d) { return d['SATAvg'] })]),
      d3.max([0,d3.max(csv,function (d) { return d['SATAvg'] })])
      ])
      .range([570, 30])

    var xScale2 = d3.scaleLinear()
      .domain([
      d3.min([0,d3.min(csv,function (d) { return d['percentWhite'] })]),
      d3.max([0,d3.max(csv,function (d) { return d['percentWhite'] })])
      ])
    .range([50, 570])

    var yScale2 = d3.scaleLinear()
      .domain([
      d3.min([0,d3.min(csv,function (d) { return d['partTime'] })]),
      d3.max([0,d3.max(csv,function (d) { return d['partTime'] })])
      ])
      .range([570, 30])

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    var xAxis2 = d3.axisBottom().scale(xScale2);
    var yAxis2 = d3.axisLeft().scale(yScale2);

    var comma = d3.format(","); //Places comma in numbers that require it.
    var formatPercent = d3.format('.2%');

    //Drop down for both charts:
    var selectFilter = [ {'text':'None'},
                        {'text' : 'Public'},
                        {'text': 'Private'},
                        ]
    var selectFilter2 = [ {'text':'None'},
                        {'text' : 'Southwest'},
                        {'text': 'Rocky Mountains'},
                        {'text': 'Mid-Atlantic'},
                        {'text' : 'Great Lakes'},
                        {'text': 'Southeast'},
                        {'text' : 'New England'},
                        {'text': 'Great Plains'},
                        {'text' : 'Far West'},
                        {'text': 'Outlying Areas'},
                        ]

    //Drop down for Chart 1:
    var selectData = [ { "text" : "ACT Median" },
                     { "text" : "Admission Rate" },
                     { "text" : "Average Cost" },
                     { "text" : "Median Debt On Graduation" },
                     { "text" : "Median Debt On Withdrawal" },
                     { "text" : "Mean Earnings 8 Years After Entry" },
                     { "text" : "Retention Rate" },
                     { "text" : "SAT Average" },
                     { "text" : "Undergraduate Population" },
    ]

    //Drop down for Chart 2:
    var selectData2 = [ { "text" : "% of White Students" },
                     { "text" : "% of Black Students" },
                     { "text" : "% of Hispanic Students" },
                     { "text" : "% of Asian Students" },
                     { "text" : "% of American Indian Students" },
                     { "text" : "% of Pacific Islander Students" },
                     { "text" : "% of Biracial Students" },
                     { "text" : "% of Nonresident Aliens" },
                     { "text" : "% of Part-Time Undergraduates" },
    ]

    //Select Chart 1 x-axis variable:
    chart4
      d3.select('#xAxisText')
      .append('select')
      .attr('id','xSelect')
      .on('change', xChange)
      .selectAll('option')
      .data(selectData)
      .enter()
      .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
      .append('br')

    //Select Chart 1 y-axis variable:
    chart4
      d3.select('#yAxisText')
      .append('select')
      .attr('id','ySelect')
      .on('change', yChange)
      .selectAll('option')
      .data(selectData)
      .enter()
      .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
      .append('br')

    //Select Chart 2 x-axis variable:
    chart5
      d3.select('#xAxis2Text')
      .append('select')
      .attr('id','xSelect')
      .on('change', xChange2)
      .selectAll('option')
      .data(selectData2)
      .enter()
      .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
      .append('br')

    //Select Chart 2 y-axis variable:
    chart5
      d3.select('#yAxis2Text')
      .append('select')
      .attr('id','ySelect')
      .on('change', yChange2)
      .selectAll('option')
      .data(selectData2)
      .enter()
      .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
      .append('br')

    //Legend and filter set-up:
    var chart6 = d3.select("#chart6")
                    .append("svg:svg")
                    .attr("width",150)
                    .attr("height",150);

    chart6
      d3.select('#filter')
    	.append('select')
    	.attr('id','FilterSelect')
    	.on('change', filter)
    	.selectAll('option')
    	.data(selectFilter)
    	.enter()
    	.append('option')
    	.attr('value', function (d) { return d.text })
    	.text(function (d) { return d.text ;})
    	.append('br')
    d3.select('#filter2')
      .append('select')
      .attr('id','FilterSelect2')
      .on('change', filter2)
      .selectAll('option')
      .data(selectFilter2)
      .enter()
      .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
      .append('br')
     var legend = d3.select("#legend")
                   .append("svg")
                   .attr("width", 300)
                   .attr("height", 300);
     legend.append('rect')
           .attr('x', 5)
           .attr('y',5)
           .attr('width',20)
           .attr('height',10)
           .attr('fill', '#900303')
           .attr('opacity', 0.8)
           .attr('stroke', 'black');
     legend.append('text')
             .attr('x', 40)
             .attr('y', 15)
             .text('Southwest');
      legend.append('rect')
           .attr('x', 5)
           .attr('y',20)
           .attr('width',20)
           .attr('height',10)
           .attr('fill', '#905F03')
           .attr('opacity', 0.8)
           .attr('stroke', 'black');
      legend.append('text')
             .attr('x', 40)
             .attr('y', 30)
             .text('Rocky Mountains');
      legend.append('rect')
           .attr('x', 5)
           .attr('y',35)
           .attr('width',20)
           .attr('height',10)
           .attr('fill', '#327834')
           .attr('opacity', 0.8)
           .attr('stroke', 'black');
      legend.append('text')
             .attr('x', 40)
             .attr('y', 45)
             .text('Mid-Atlantic');
      legend.append('rect')
           .attr('x', 5)
           .attr('y',50)
           .attr('width',20)
           .attr('height',10)
           .attr('fill', '#E30808')
           .attr('opacity', 0.8)
           .attr('stroke', 'black');
      legend.append('text')
             .attr('x', 40)
             .attr('y', 60)
             .text('Greate Lakes');
      legend.append('rect')
           .attr('x', 5)
           .attr('y',65)
           .attr('width',20)
           .attr('height',10)
           .attr('fill', '#F8B205')
           .attr('opacity', 0.8)
           .attr('stroke', 'black');
      legend.append('text')
             .attr('x', 40)
             .attr('y', 75)
             .text('Southeast');
      legend.append('rect')
           .attr('x', 5)
           .attr('y',80)
           .attr('width',20)
           .attr('height',10)
           .attr('fill', '#FFFB03')
           .attr('opacity', 0.8)
           .attr('stroke', 'black');
      legend.append('text')
             .attr('x', 40)
             .attr('y', 90)
             .text('New England');
      legend.append('rect')
           .attr('x', 5)
           .attr('y',95)
           .attr('width',20)
           .attr('height',10)
           .attr('fill', '#FB9BBD')
           .attr('opacity', 0.8)
           .attr('stroke', 'black');
      legend.append('text')
             .attr('x', 40)
             .attr('y', 105)
             .text('Great Plains');
      legend.append('rect')
           .attr('x',5)
           .attr('y',110)
           .attr('width',20)
           .attr('height',10)
           .attr('fill', '#D6DDA7')
           .attr('opacity', 0.8)
           .attr('stroke', 'black');
      legend.append('text')
             .attr('x', 40)
             .attr('y', 120)
             .text('Far West');
      legend.append('rect')
           .attr('x', 5)
           .attr('y',125)
           .attr('width',20)
           .attr('height',10)
           .attr('fill', '#F58C4C')
      legend.append('text')
             .attr('x', 40)
             .attr('y', 135)
             .text('Outlying Areas');



//---------------FUNCTIONS--------------------

   //Filter based on private/public type:
   function filter() {
      var value = this.value;
      if (value != 'None'){
        d3.selectAll('circle')
          .filter(function(d){
            return d.Control != value;
          })
          .transition()
          .attr('r',0)
        d3.selectAll('circle')
          .filter(function(d){
            return d.Control == value;
          })
          .transition()
          .attr('r',10)
      } else {
        d3.selectAll('circle')
          .filter(function(d){
            return true;
          })
          .transition()
          .attr('r',10)
      }
   }
    function filter2() {
      var value = this.value;
      if (value != 'None'){
        d3.selectAll('circle')
          .filter(function(d){
            return d.Region != value;
          })
          .transition()
          .attr('r',0)
        d3.selectAll('circle')
          .filter(function(d){
            return d.Region == value;
          })
          .transition()
          .attr('r',10)
      } else {
        d3.selectAll('circle')
          .filter(function(d){
            return true;
          })
          .transition()
          .attr('r',10)
          
      }
   }

    //Function to change xAxis:
    function xChange() {
      changedX = 1;
      var value = this.value //Get the new 'x' value.
      var axisTitle = '';
      if (value == 'ACT Median') {
        axisTitle = 'ACT Median';
        value = 'ACTMedian';
      } else if (value == 'Admission Rate') {
        axisTitle = 'Admission Rate (%)';
        value = 'AdmissionRate';
      } else if (value == 'Average Cost') {
        axisTitle = 'Average Cost ($)';
        value = 'AverageCost';
      } else if (value == 'Median Debt On Graduation') {
        axisTitle = 'Median Debt On Graduation ($)';
        value = 'MedDebtGrad';
      } else if (value == 'Median Debt On Withdrawal') {
        axisTitle = 'Median Debt On Withdrawal ($)';
        value = 'MedDebtWithdraw';
      } else if (value == 'Mean Earnings 8 Years After Entry') {
        axisTitle = 'Mean Earnings ($)';
        value = 'MeanEarnAfter8';
      } else if (value == 'Retention Rate') {
        axisTitle = 'Retention Rate (%)';
        value = 'RetentionRate';
      } else if (value == 'SAT Average') {
        axisTitle = 'SAT Average';
        value = 'SATAvg';
      } else if (value == 'Undergraduate Population') {
        axisTitle = 'Undergraduate Population';
        value = 'UndergradPop';
      }
      axisValX = value;
      xScale //Change the xScale.
        .domain([
          d3.min([0,d3.min(csv,function (d) { return d[value] })]),
          d3.max([0,d3.max(csv,function (d) { return d[value] })])
          ])
      xAxis.scale(xScale) //Change the xScale.
      d3.select('#xAxis') //Redraw the xAxis.
        .transition().duration(1000)
        .call(xAxis)
      d3.select('#xAxisLabel') //Change the xAxisLabel.
        .transition().duration(1000)
        .text(axisTitle)
      d3.select('#chart1').selectAll('circle') //Move the circles.
        .transition().duration(50)
        .delay(function (d,i) { return i * 10})
          .attr('cx',function (d) {
            d.cx1 = xScale(d[value]);
            return d.cx1; })
    }

    //Function to change yAxis:
    function yChange() {
      changedY = 1;
      var value = this.value //Get the new 'y' value.
      var axisTitle = '';
      if (value == 'ACT Median') {
        axisTitle = 'ACT Median';
        value = 'ACTMedian';
      } else if (value == 'Admission Rate') {
        axisTitle = 'Admission Rate (%)';
        value = 'AdmissionRate';
      } else if (value == 'Average Cost') {
        axisTitle = 'Average Cost ($)';
        value = 'AverageCost';
      } else if (value == 'Median Debt On Graduation') {
        axisTitle = 'Median Debt On Graduation ($)';
        value = 'MedDebtGrad';
      } else if (value == 'Median Debt On Withdrawal') {
        axisTitle = 'Median Debt On Withdrawal ($)';
        value = 'MedDebtWithdraw';
      } else if (value == 'Mean Earnings 8 Years After Entry') {
        axisTitle = 'Mean Earnings ($)';
        value = 'MeanEarnAfter8';
      } else if (value == 'Retention Rate') {
        axisTitle = 'Retention Rate (%)';
        value = 'RetentionRate';
      } else if (value == 'SAT Average') {
        axisTitle = 'SAT Average';
        value = 'SATAvg';
      } else if (value == 'Undergraduate Population') {
        axisTitle = 'Undergraduate Population';
        value = 'UndergradPop';
      }
      axisValY = value;
      yScale //Change the yScale.
        .domain([
          d3.min([0,d3.min(csv,function (d) { return d[value] })]),
          d3.max([0,d3.max(csv,function (d) { return d[value] })])
          ])
      yAxis.scale(yScale) //Change the yScale.
      d3.select('#yAxis') //Redraw the yAxis.
        .transition().duration(1000)
        .call(yAxis)
      d3.select('#yAxisLabel') //Change the yAxisLabel.
        .text(axisTitle)
      d3.select('#chart1').selectAll('circle') //Move the circles.
        .transition().duration(50)
        .delay(function (d,i) { return i * 10})
          .attr('cy',function (d) {
            d.cy1 = yScale(d[value])
            return d.cy1; })
    }

    //Function to change xAxis2:
    function xChange2() {
      changedX2 = 1;
      var value = this.value //Get the new 'x' value.
      var axisTitle = '';
      if (value == '% of White Students') {
        axisTitle = 'Whites (%)';
        value = 'percentWhite';
      } else if (value == '% of Black Students') {
        axisTitle = 'Blacks (%)';
        value = 'percentBlack';
      } else if (value == '% of Hispanic Students') {
        axisTitle = 'Hispanics (%)';
        value = 'percentHispanic';
      } else if (value == '% of Asian Students') {
        axisTitle = 'Asians (%)';
        value = 'percentAsian';
      } else if (value == '% of American Indian Students') {
        axisTitle = 'American Indians (%)';
        value = 'percentIndian';
      } else if (value == '% of Pacific Islander Students') {
        axisTitle = 'Pacific Islanders (%)';
        value = 'percentIslander';
      } else if (value == '% of Biracial Students') {
        axisTitle = 'Biracial (%)';
        value = 'percentBiracial';
      } else if (value == '% of Nonresident Aliens') {
        axisTitle = 'Nonresident Aliens (%)';
        value = 'percentAlien';
      } else if (value == '% of Part-Time Undergraduates') {
        axisTitle = 'Part-Time Undergrads(%)';
        value = 'partTime';
      }
      axisValX2 = value;
      xScale2 //Change the xScale.
        .domain([
          d3.min([0,d3.min(csv,function (d) { return d[value] })]),
          d3.max([0,d3.max(csv,function (d) { return d[value] })])
          ])
      xAxis2.scale(xScale2) //Change the xScale.
      d3.select('#xAxis2') //Redraw the xAxis.
        .transition().duration(1000)
        .call(xAxis2)
      d3.select('#xAxisLabel2') //Change the xAxisLabel.
        .transition().duration(1000)
        .text(axisTitle)
      d3.select('#chart2')
        .selectAll('circle') //Move the circles.
        .transition().duration(50)
        .delay(function (d,i) { return i * 10})
          .attr('cx',function (d) {
            d.cx2 = xScale2(d[value]);
            return  d.cx2;})
    }

    //Function to change yAxis2:
    function yChange2() {
      changedY2 = 1;
      var value = this.value //Get the new 'y' value.
      var axisTitle = '';
      if (value == '% of White Students') {
        axisTitle = 'Whites (%)';
        value = 'percentWhite';
      } else if (value == '% of Black Students') {
        axisTitle = 'Blacks (%)';
        value = 'percentBlack';
      } else if (value == '% of Hispanic Students') {
        axisTitle = 'Hispanics (%)';
        value = 'percentHispanic';
      } else if (value == '% of Asian Students') {
        axisTitle = 'Asians (%)';
        value = 'percentAsian';
      } else if (value == '% of American Indian Students') {
        axisTitle = 'American Indians (%)';
        value = 'percentIndian';
      } else if (value == '% of Pacific Islander Students') {
        axisTitle = 'Pacific Islanders (%)';
        value = 'percentIslander';
      } else if (value == '% of Biracial Students') {
        axisTitle = 'Biracial (%)';
        value = 'percentBiracial';
      } else if (value == '% of Nonresident Aliens') {
        axisTitle = 'Nonresident Aliens (%)';
        value = 'percentAlien';
      } else if (value == '% of Part-Time Undergraduates') {
        axisTitle = 'Part-Time Undergrads(%)';
        value = 'partTime';
      }
      axisValY2 = value;
      yScale2 //Change the yScale.
        .domain([
          d3.min([0,d3.min(csv,function (d) { return d[value] })]),
          d3.max([0,d3.max(csv,function (d) { return d[value] })])
          ])
      yAxis2.scale(yScale2) //Change the yScale.
      d3.select('#yAxis2') //Redraw the yAxis.
        .transition().duration(1000)
        .call(yAxis2)
      d3.select('#yAxisLabel2') //Change the yAxisLabel.
        .text(axisTitle)
      d3.select('#chart2')
        .selectAll('circle') //Move the circles.
        .transition().duration(50)
        .delay(function (d,i) { return i * 10})
          .attr('cy',function (d) {
            d.cy2 = yScale2(d[value]);
            return d.cy2; })
    }

    //Axis labels:
    //Create SVGs for charts:
    var chart1 = d3.select("#chart1")
                    .append("svg:svg")
                    .attr("width",width)
                    .attr("height",height);


    var chart2 = d3.select("#chart2")
                    .append("svg:svg")
                    .attr("width",width)
                    .attr("height",height);

    //Chart 1 axis titles:
    chart1
        .append("g")
        .attr("transform", "translate(0,"+ (width -30)+ ")")
        .attr('class','axis')
        .attr('id','xAxis')
        .call(xAxis)
        .append("text")
        .attr("id", "xAxisLabel")
        .attr("x", width - 16)
        .attr("y", -6)
        .attr("font-family", "SchoolBookFont")
        .style("font-size", "16px")
        .style("text-anchor", "end")
        .style("fill", "black")
        .text("Median ACT");

    chart1
        .append("g")
        .attr("transform", "translate(50, 0)")
        .attr('class','axis')
        .attr('id','yAxis')
        .call(yAxis)
        .append("text")
        .attr("id", "yAxisLabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("font-family", "SchoolBookFont")
        .style("font-size", "16px")
        .style("text-anchor", "end")
        .style("fill", "black")
        .text("Average SAT");

    //Chart 2 axis titles:
    chart2
        .append("g")
        .attr("transform", "translate(0,"+ (width -30)+ ")")
        .attr('class','axis')
        .attr('id','xAxis2')
        .call(xAxis2)
        .append("text")
        .attr("id", "xAxisLabel2")
        .attr("x", width-16)
        .attr("y", -6)
        .attr("font-family", "SchoolBookFont")
        .style("font-size", "16px")
        .style("text-anchor", "end")
        .style("fill", "black")
        .text("Whites (%)");

    chart2
        .append("g")
        .attr("transform", "translate(50, 0)")
        .attr('class','axis')
        .attr('id','yAxis2')
        .call(yAxis2)
        .append("text")
        .attr("id", "yAxisLabel2")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("font-family", "SchoolBookFont")
        .style("font-size", "16px")
        .style("text-anchor", "end")
        .style("fill", "black")
        .text("Part-Time Undergrads (%)");


//---------------BRUSH CODE--------------------

//---------------FIRST BRUSH-------------------

    var brushContainerG = chart1.append('g')
              .attr('id', 'brush-container');

    var brush = d3.brush()
              .extent([[-10, -10], [width + 10, height + 10]]);

    brush.on('start', handleBrushStart)
      .on('brush', handleBrushMove)
      .on('end', handleBrushEnd);

    brushContainerG.call(brush);

    function handleBrushStart(p) {
        console.log('%cBrush START!!', 'color: green');
        brush.move(brushContainerG, null);
        brush2.move(brushContainerH, null);
    }

    function handleBrushMove() {
      console.log('%cBrush MOVING....', 'color: blue');
      var sel = d3.event.selection;
      if (!sel) {
        return;
      }

      var [[left, top], [right, bottom]] = sel;
      console.log({left, top, right, bottom})

      d3.selectAll('circle')
        .classed('selected', function(d) {
            return left <= d.cx1 && d.cx1 <= right && top <= d.cy1 && d.cy1 <= bottom;
        });

      d3.selectAll('circle')
        .classed('selected', function(d) {

            return left <= d.cx1 && d.cx1 <= right && top <= d.cy1 && d.cy1 <= bottom;
        });
    }

    function handleBrushEnd() {
      console.log('%cBrush END!!', 'color: red');
      if (!d3.event.selection) {
        clearSelected();
      }
    }

    function clearSelected() {
      d3.selectAll('circle').classed('selected', false);
      d3.selectAll('circle').classed('selected2', false);
    }

    //---------------SECOND BRUSH-------------------

    var brushContainerH = chart2.append('g')
              .attr('id', 'brush-container');

    var brush2 = d3.brush()
              .extent([[-10, -10], [width + 10, height + 10]]);

    brush2.on('start', handleBrushStart2)
      .on('brush', handleBrushMove2)
      .on('end', handleBrushEnd2);

    brushContainerH.call(brush2);

    function handleBrushStart2() {
        console.log('%cBrush START!!', 'color: green');
        brush.move(brushContainerG, null);
        brush2.move(brushContainerH, null);
    }

    function handleBrushMove2() {
      console.log('%cBrush MOVING....', 'color: blue');
      var sel = d3.event.selection;
      if (!sel) {
        return;
      }

      var [[left, top], [right, bottom]] = sel;
      console.log({left, top, right, bottom})

      d3.selectAll('circle')
        .classed('selected', function(d) {

            return left <= d.cx2 && d.cx2 <= right && top <= d.cy2 && d.cy2 <= bottom;
        });


      d3.selectAll('circle')
        .classed('selected2', function(d) {

            return left <= d.cx2 && d.cx2 <= right && top <= d.cy2 && d.cy2 <= bottom;
        });
    }

    function handleBrushEnd2() {
      console.log('%cBrush END!!', 'color: red');
      if (!d3.event.selection) {
        clearSelected();
      }
    }

    //Displaying circles:
    function checkChart1(thisCircle) {
        d3.selectAll('circle').classed('selected', function(d) {
            if (d == thisCircle) {
                return true;
            } else {
                return false;
            }
        });
    }

    function checkChart2(thisCircle) {
        d3.selectAll('circle').classed('selected2', function(d) {
            if (d == thisCircle) {
                return true;
            } else {
                return false;
            }
        });
    }

    var newBox = document.querySelector("svg");
    document.addEventListener("click", function(event) {
        if(event.target.closest("svg")) return;
            brush.move(brushContainerG, null);
            brush2.move(brushContainerH, null);
    });

     //Add scatterplot points:
     var temp1 = chart1.selectAll("circle")
       .data(csv)
       .enter()
       .append("circle")
       .attr("id",function(d,i) {return i;} )
       .attr('fill',function (d,i) {
            return d.RegionColor;
          })
       .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r', 20)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r', 10)
          .attr('stroke-width',1)
      })
       .attr("stroke", "black")
       .style("opacity", 0.8)
       .attr("cx", function(d) {
          d.cx1 = xScale(d.ACTMedian);
        return d.cx1; })
       .attr("cy", function(d) {
          d.cy1 = yScale(d.SATAvg);
        return d.cy1; })
       .attr("r", 10)
       .on("click", function(d,i){
        clearSelected();
        handleBrushStart();
        d3.select(this)
            .classed('selected', true);
        d3.select('#name')
            .text(d.Name)
        d3.select('#type')
            .text(d.Control)
        d3.select('#region')
            .text(d.Region)
        d3.select('#actmed')
            .text(d.ACTMedian)
        d3.select('#satavg')
            .text(d.SATAvg)
        d3.select('#meddebtgrad')
            .text("$" + comma(d.MedDebtGrad))
        d3.select('#meanearn8')
            .text("$" + comma(d.MeanEarnAfter8))
        d3.select('#avgcost')
            .text("$" + comma(d.AverageCost))
        d3.select('#retrate')
            .text(d.RetentionRate + "%")
        d3.select('#white')
            .text(Math.round(d.percentWhite *100)+'%')
        d3.select('#black')
            .text(Math.round(d.percentBlack *100)+'%')
        d3.select('#hispanic')
            .text(Math.round(d.percentHispanic *100)+'%')
        d3.select('#asian')
            .text(Math.round(d.percentAsian *100)+'%')
        d3.select('#indian')
            .text(Math.round(d.percentIndian *100)+'%')
        d3.select('#islander')
            .text(Math.round(d.percentIslander *100)+'%')
        d3.select('#biracial')
            .text(Math.round(d.percentBiracial *100)+'%')
        d3.select('#alien')
            .text(Math.round(d.percentAlien *100)+'%')
        d3.select('#parttime')
            .text(Math.round(d.partTime *100)+'%' )
        checkChart2(d);
        d3.select(this).raise().classed
       });

    var temp2 = chart2.selectAll("circle")
       .data(csv)
       .enter()
       .append("circle")
       .attr("id",function(d,i) {return i;} )
       .attr('fill',function (d,i) {
            return d.RegionColor;
          })
       .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r', 20)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r', 10)
          .attr('stroke-width',1)
      })
       .attr("stroke", "black")
       .style("opacity", 0.8)
       .attr("cx", function(d) {
          d.cx2 =  xScale2(d.percentWhite);
          return d.cx2; })
       .attr("cy", function(d) {
          d.cy2 = yScale2(d.partTime);
        return d.cy2 })
       .attr("r", 10)
       .on("click", function(d,i){
        clearSelected();
        handleBrushStart();
        d3.select(this)
            .classed('selected2', true)
        d3.select('#name')
            .text(d.Name)
        d3.select('#type')
            .text(d.Control)
        d3.select('#region')
            .text(d.Region)
        d3.select('#actmed')
            .text(d.ACTMedian)
        d3.select('#satavg')
            .text(d.SATAvg)
        d3.select('#meddebtgrad')
            .text("$" + comma(d.MedDebtGrad))
        d3.select('#meanearn8')
            .text("$" + comma(d.MeanEarnAfter8))
        d3.select('#avgcost')
            .text("$" + comma(d.AverageCost))
        d3.select('#retrate')
            .text(d.RetentionRate + "%")
                d3.select(this)
            .classed('selected2', true)
        d3.select('#white')
            .text(Math.round(d.percentWhite *100)+'%')
        d3.select('#black')
            .text(Math.round(d.percentBlack *100)+'%')
        d3.select('#hispanic')
            .text(Math.round(d.percentHispanic *100)+'%')
        d3.select('#asian')
            .text(Math.round(d.percentAsian *100)+'%')
        d3.select('#indian')
            .text(Math.round(d.percentIndian *100)+'%')
        d3.select('#islander')
            .text(Math.round(d.percentIslander *100)+'%')
        d3.select('#biracial')
            .text(Math.round(d.percentBiracial *100)+'%')
        d3.select('#alien')
            .text(Math.round(d.percentAlien *100)+'%')
        d3.select('#parttime')
            .text(Math.round(d.partTime *100)+'%' )
        checkChart1(d);
       });
});
