//Final Project: "College Stats Across the U.S."
//CS 4460: P5
//Group: Chianne Connelly (903047323), Melanie Hall (903112239), and Wheezy Menk (903104394)
//Data: 'colleges.csv'

//Set heighth and width of charts:
var width = 600;
var height = 600;

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
    //var xScale = d3.scaleLinear().domain(ACTMedianExtent).range([50, 570]);
    //var yScale = d3.scaleLinear().domain(SATAvgExtent).range([570, 30]);


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

    // var xScale2 = d3.scaleLinear().domain(MedDebtGradExtent).range([50, 570]);
    // var yScale2 = d3.scaleLinear().domain(MeanEarnAfter8Extent).range([570, 30]);

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

    chart6
    d3.select("#public")
    .append('rect')
          .attr('x', 20)
          .attr('y',10)
          .attr('width',20)
          .attr('height',10)
          .attr('fill','#ffae3d')
    d3.select("#private")
    .append('rect')
          .attr('x', 20)
          .attr('y',30)
          .attr('width',20)
          .attr('height',10)
          .attr('fill','#0209e5')

     var legend = d3.select("#legend")
                   .append("svg")
                   .attr("width", 150)
                   .attr("height", 150);
     legend.append('rect')
           .attr('x', 20)
           .attr('y',10)
           .attr('width',20)
           .attr('height',10)
           .attr('fill','#ffae3d');
     legend.append('text')
             .attr('x', 50)
             .attr('y', 20)
             .text('Public');
     legend.append('rect')
           .attr('x', 20)
           .attr('y',30)
           .attr('width',20)
           .attr('height',10)
           .attr('fill','#0209e5');
     legend.append('text')
             .attr('x', 50)
             .attr('y',40)
             .text('Private');

//---------------FUNCTIONS--------------------

   //Filter based on private/public type:
   function filter() {
      var value = this.value;
      if (value !='None'){
        d3.selectAll('circle')
          .filter(function(d){
            return d.Control != value;
          })
          .transition()
          .style("opacity", 0);
        d3.selectAll('circle')
          .filter(function(d){
            return d.Control == value;
          })
          .transition()
          .style("opacity", 0.8)
          .attr('stroke-width',1);
      } else {
        d3.selectAll('circle')
          .filter(function(d){
            return true;
          })
          .transition()
          .style("opacity", 0.8)
          .attr('stroke-width',1);
      }
   }

    //Function to change xAxis:
    function xChange() {
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
        value = 'MedDebtGrad';
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
      d3.selectAll('circle') //Move the circles.
        .transition().duration(50)
        .delay(function (d,i) { return i * 10})
          .attr('cx',function (d) { return xScale(d[value]) })
    }

    //Function to change yAxis:
    function yChange() {
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
        value = 'MedDebtGrad';
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
      d3.selectAll('circle') //Move the circles.
        .transition().duration(50)
        .delay(function (d,i) { return i * 10})
          .attr('cy',function (d) { return yScale(d[value]) })
    }

    //Function to change xAxis2:
    function xChange2() {
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
      d3.selectAll('circle') //Move the circles.
        .transition().duration(50)
        .delay(function (d,i) { return i * 10})
          .attr('cx',function (d) { return xScale2(d[value]) })
    }

    //Function to change yAxis2:
    function yChange2() {
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
      d3.selectAll('circle') //Move the circles.
        .transition().duration(50)
        .delay(function (d,i) { return i * 10})
          .attr('cy',function (d) { return yScale2(d[value]) })
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
        .style("font-size", "14px")
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
        .style("font-size", "14px")
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
        .style("font-size", "14px")
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
        .style("font-size", "14px")
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
          var cx = xScale(d['ACTMedian']);
          var cy = yScale(d['SATAvg']);
          return left <= cx && cx <= right && top <= cy && cy <= bottom;
        });

      d3.selectAll('circle')
        .classed('selected', function(d) {
          var cx = xScale(d['ACTMedian']);
          var cy = yScale(d['SATAvg']);
          return left <= cx && cx <= right && top <= cy && cy <= bottom;
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
          var cx = xScale(d['percentWhite']);
          var cy = yScale(d['partTime']);
          return left <= cx && cx <= right && top <= cy && cy <= bottom;
        });

      d3.selectAll('circle')
        .classed('selected2', function(d) {
          var cx = xScale2(d['percentWhite']);
          var cy = yScale2(d['partTime']);
          return left <= cx && cx <= right && top <= cy && cy <= bottom;
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
            if (d.Control == 'Public'){
              return '#ffae3d';
            }
            return '#0209e5';})
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
       .attr("cx", function(d) { return xScale(d.ACTMedian); })
       .attr("cy", function(d) { return yScale(d.SATAvg); })
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
        checkChart2(d);
       });

    var temp2 = chart2.selectAll("circle")
       .data(csv)
       .enter()
       .append("circle")
       .attr("id",function(d,i) {return i;} )
       .attr('fill',function (d,i) {
            if (d.Control == 'Public'){
              return '#ffae3d';
            }
            return '#0209e5';
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
       .attr("cx", function(d) { return xScale2(d.percentWhite); })
       .attr("cy", function(d) { return yScale2(d.partTime); })
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
        checkChart1(d);
       });
});
