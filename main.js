//Final Project: "A 'School' Look At Data"
//CS 4460: P5
//Group: Chianne Connelly (903047323), Melanie Hall (903112239), and Wheezy Menk (903104394)
//Data: 'colleges.csv;

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
 
    var xScale2 = d3.scaleLinear().domain(MedDebtGradExtent).range([50, 570]);
    var yScale2 = d3.scaleLinear().domain(MeanEarnAfter8Extent).range([570, 30]);
     
    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);
  
    var xAxis2 = d3.axisBottom().scale(xScale2);
    var yAxis2 = d3.axisLeft().scale(yScale2);

    var comma = d3.format(","); //Places comman in numbers that require it.
    var formatPercent = d3.format('.2%');

    var body = d3.select('body')
    var selectFilter = [ {'text':'None'},
                        {'text' : 'Public'},
                        {'text': 'Private'},
                        ]
    var selectData = [ { "text" : "ACTMedian" },
                     { "text" : "AdmissionRate" },
                     { "text" : "AverageCost" },
                     { "text" : "MedDebtGrad" },
                     { "text" : "MedDebtWithdraw" },
                     { "text" : "MeanEarnAfter8" },
                     { "text" : "RetentionRate" },
                     { "text" : "SATAvg" },
                     { "text" : "UndergradPop" },
                   ]             

    //Select x-axis variable:
    chart4
      .append('g') 
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

    //Select y-axis variable:
    chart4
      .append('g')
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

    //Function to change yAxis:
    function yChange() {
      var value = this.value //Get the new 'y' value.
      yScale //Change the yScale.
        .domain([
          d3.min([0,d3.min(csv,function (d) { return d[value] })]),
          d3.max([0,d3.max(csv,function (d) { return d[value] })])
          ])
      console.log("is this working?");  
      yAxis.scale(yScale) //Change the yScale.
      d3.select('#yAxis') //Redraw the yAxis.
        .transition().duration(1000)
        .call(yAxis)
      d3.select('#yAxisLabel') //Change the yAxisLabel.
        .text(value)    
      d3.selectAll('circle') //Move the circles.
        .transition().duration(50)
        .delay(function (d,i) { return i * 10})
          .attr('cy',function (d) { return yScale(d[value]) })
    }

    //Function to change xAxis:
    function xChange() {
      var value = this.value //Get the new 'x' value.
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
        .text(value)
      d3.selectAll('circle') //Move the circles.
        .transition().duration(50)
        .delay(function (d,i) { return i * 10})
          .attr('cx',function (d) { return xScale(d[value]) })
    }


    var spanChart2 = body.append('span')
      .text("Chart 2:")  
      body.append('br')             

    //Select x-axis variable:               
    var spanTextX2 = body.append('span')
      .text("Select X-Axis Variable: ")
    var input3 = body.append('select')
      .attr('id','xSelect')
      .on('change', xChange2)
      .selectAll('option')
      .data(selectData)
      .enter()
      .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
    body.append('br')                 

    //Select y-axis variable:
    var spanTextY2 = body.append('span')
      .text("Select Y-Axis Variable: ")
    var input4 = body.append('select')
      .attr('id','ySelect')
      .on('change', yChange2)
      .selectAll('option')
      .data(selectData)
      .enter()
      .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
    body.append('br') 

    //Function to change yAxis:
    function yChange2() {
      var value = this.value //Get the new 'y' value.
      yScale2 //Change the yScale.
        .domain([
          d3.min([0,d3.min(csv,function (d) { return d[value] })]),
          d3.max([0,d3.max(csv,function (d) { return d[value] })])
          ])
      console.log("is this working?");  
      yAxis2.scale(yScale2) //Change the yScale.
      d3.select('#yAxis2') //Redraw the yAxis.
        .transition().duration(1000)
        .call(yAxis2)
      d3.select('#yAxisLabel2') //Change the yAxisLabel.
        .text(value)    
      d3.selectAll('circle') //Move the circles.
        .transition().duration(50)
        .delay(function (d,i) { return i * 10})
          .attr('cy',function (d) { return yScale2(d[value]) })
    }

    //Function to change xAxis:
    function xChange2() {
      var value = this.value //Get the new 'x' value.
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
        .text(value)
      d3.selectAll('circle') //Move the circles.
        .transition().duration(50)
        .delay(function (d,i) { return i * 10})
          .attr('cx',function (d) { return xScale2(d[value]) })
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
        .text("Median Debt ($)");

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
        .text("Mean Earnings ($)");                            
        

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
          var cx = xScale(d['MedDebtGrad']);
          var cy = yScale(d['MeanEarnAfter8']);
          return left <= cx && cx <= right && top <= cy && cy <= bottom;
        });

      d3.selectAll('circle')
        .classed('selected2', function(d) {
          var cx = xScale2(d['MedDebtGrad']);
          var cy = yScale2(d['MeanEarnAfter8']);
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
       .attr("cx", function(d) { return xScale2(d.MedDebtGrad); })
       .attr("cy", function(d) { return yScale2(d.MeanEarnAfter8); })
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
