/*
Title: "A Sweet Visualization"
Group: Chianne Connelly () and Melanie Hall (903112239)
CS 4460: P5
Dataset: 'candy.csv' 
Categories: Gender, Age, Country, Candies w/ JOY, MEH, or DESPAIR.
*/

var svg = d3.select('svg');

var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var barPadding = {t: 40, r: 25, b: 60, l: 40};
var histoPadding = {t: 40, r: 15, b: 60, l: 20};

var chartNames = ["density", "pop", "land"];

barChartWidth = svgWidth / 3.7 - barPadding.l - barPadding.r;
barChartHeight = svgHeight / 1.45 - barPadding.t - barPadding.b;

histogramWidth = svgWidth / 3.4 - barPadding.l - barPadding.r;
histogramHeight = svgHeight / .92 - barPadding.t - barPadding.b;

var barBand = barChartHeight / 22;
var barHeight = 4;


// Color mapping based on year
var yearColors = {2000: '#8c8c8c', 2010: '#d86763'};
var valueColors = ['#fcc9b5','#fa8873','#d44951','#843540'];

var brush = d3.brushX()
    .extent([[0, 0], [histogramWidth, histogramHeight]])
    .on("start", brushstart)
    .on("brush", brushmove)
    .on("end", brushend);

var brushCell;    


// Dataset from http://nbremer.github.io/urbanization/
d3.csv('./data/candy.csv',
function(row){
    // This callback formats each row of the data
    return {
        city: row.city,
        country: row.country,
        type_country: row.type_country,
        land_2000: +row.land_2000,
        land_2010: +row.land_2010,
        land_growth: +row.land_growth,
        pop_2000: +row.pop_2000,
        pop_2010: +row.pop_2010,
        pop_growth: +row.pop_growth,
        density_2000: +row.density_2000,
        density_2010: +row.density_2010,
        density_growth: +row.density_growth
    }
},
function(error, dataset){
    if(error) {
        console.error('Error while loading ./data/candy.csv dataset.');
        console.error(error);
        return;
    }

    // **** Your JavaScript code goes here ****
    var barChartNested = d3.nest()
        .key(function(d) { return d.country; })
        .rollup(function(v) { return {
            density_2000: d3.mean(v, function(d) { return d.density_2000; }),
            pop_2000: d3.sum(v, function(d) { return d.pop_2000; }),
            land_2000: d3.sum(v, function(d) { return d.land_2000; }),
            density_2010: d3.mean(v, function(d) { return d.density_2010; }),
            pop_2010: d3.sum(v, function(d) { return d.pop_2010; }),
            land_2010: d3.sum(v, function(d) { return d.land_2010; })
            }; 
        })
    .entries(dataset);


    //Sorting data by 2010 values for each bar chart
    var densityBarData = barChartNested.slice(0).sort(function(x, y){
        return d3.descending(x.value.density_2010, y.value.density_2010);
    })

    var popBarData = barChartNested.slice(0).sort(function(x, y){
        return d3.descending(x.value.pop_2010, y.value.pop_2010);
    })

    var landBarData = barChartNested.slice(0).sort(function(x, y){
        return d3.descending(x.value.land_2010, y.value.land_2010);
    })

    var maxDensity = d3.max(densityBarData, function(d){
        return d.value.density_2010;
    });

    var minDensity = d3.min(densityBarData, function(d){
        return d.value.density_2010;
    });

    var maxPop = d3.max(popBarData, function(d){
        return d.value.pop_2010;
    });

    var minPop = d3.min(popBarData, function(d){
        return d.value.pop_2010;
    });

    var maxLand = d3.max(landBarData, function(d){
        return d.value.land_2010;
    });

    var minLand = d3.min(landBarData, function(d){
        return d.value.land_2010;
    });

    var densityExtent = d3.extent(dataset, function(d) { return d.density_growth; });
    var popExtent = d3.extent(dataset, function(d) { return d.pop_growth; });
    var landExtent = d3.extent(dataset, function(d) { return d.land_growth; }); 

    svg.selectAll('.histograms')
        .data(['A', 'B', 'C']) 
        .enter()
        .append('g') 
        .attr('class', function (d,i) { 
            return "histograms " + chartNames[i];
        })
        .attr('id', function (d,i) { 
            return chartNames[i];
        })
        .attr('width', histogramWidth)
        .attr('height', histogramHeight)
        .attr('transform', function(d, i) {
            var tx = 230 + (i % 3) * (histogramWidth + histoPadding.l + histoPadding.r) + histoPadding.l;
            var ty = 10;
            return 'translate('+[tx, ty]+')';
        }) 

    //Scales for each histogram
    xDensityGrowthScale = d3.scaleLinear()
        .range([0, histogramWidth])
        .domain(densityExtent);

    yDensityGrowthScale = d3.scaleLinear()
        .domain([0,155])
        .range([histogramHeight,10]); 

    xPopGrowthScale = d3.scaleLinear()
        .range([0, histogramWidth])
        .domain(popExtent);

    yPopGrowthScale = d3.scaleLinear()
        .domain([0,155])
        .range([histogramHeight,10]);

    xLandGrowthScale = d3.scaleLinear()
        .range([0, histogramWidth])
        .domain(landExtent);

    yLandGrowthScale = d3.scaleLinear()
        .domain([0,155])
        .range([histogramHeight,10]);            

    densityGrowthBins = d3.histogram()
        .value(function(d) { return d.density_growth; })
        .domain(xDensityGrowthScale.domain())
        .thresholds(xDensityGrowthScale.ticks(80));

    popGrowthBins = d3.histogram()
        .value(function(d) { return d.pop_growth; })
        .domain(xPopGrowthScale.domain())
        .thresholds(xPopGrowthScale.ticks(80)); 

    landGrowthBins = d3.histogram()
        .value(function(d) { return d.land_growth; })
        .domain(xLandGrowthScale.domain())
        .thresholds(xLandGrowthScale.ticks(80));   

    quantizeScaleDensity = d3.scaleQuantize()
        .domain([0, 15000])
        .range(valueColors); 

    quantizeScalePop = d3.scaleQuantize()
        .domain([300000, 4000000])
        .range(valueColors); 

    quantizeScaleLand = d3.scaleQuantize()
        .domain([60, 800])
        .range(valueColors);                  

    groupedDensity = densityGrowthBins(dataset);
    groupedPop = popGrowthBins(dataset); 
    groupedLand = landGrowthBins(dataset);

    for (var i=0; i<groupedDensity.length; i++) {
        var densityHistoData = groupedDensity[i].sort(function(x, y){
                return d3.descending(x.density_2010, y.density_2010);
        });

        svg.selectAll('.circles density')
            .data(densityHistoData)
            .enter()
            .append('circle')
            .attr('class', function(d, i) {
                return 'circles ' + chartNames[0];
            })
            .attr('cx', function(d) {
                return xDensityGrowthScale(densityHistoData['x0']) + histogramWidth-113;
            })
            .attr('cy', function(d, i) {
                return histogramHeight - (i*4.3)-2;
            })
            .attr('r', function (d) {
                return 2;
            })
            .style('fill', function (d, i) {
                return quantizeScaleDensity(densityHistoData[i]["density_2010"]);
            })
    }
    svg.select('#density')
        .append('g')
        .attr('class', 'brush')
        .datum({
            scale: xDensityGrowthScale,
            attr_name: 'density_growth'
        })
    .call(brush);

    for (var j=0; j<groupedPop.length; j++) {
        var popHistoData = groupedPop[j].sort(function(x, y){
                return d3.descending(x.pop_2010, y.pop_2010);
        });

        svg.selectAll('.circles pop')
            .data(popHistoData)
            .enter()
            .append('circle')
            .attr('class', function(d, i) {
                return 'circles ' + chartNames[2];
            })
            .attr('cx', function(d) {
                return xPopGrowthScale(popHistoData['x0']) + histogramWidth*2-73;
            })
            .attr('cy', function(d, i) {
                return histogramHeight - (i*4.3)-2;
            })
            .attr('r', function (d) {
                return 2;
            })
            .style('fill', function (d, i) {
                return quantizeScalePop(popHistoData[i]["pop_2010"]);
            })
    }
    svg.select('#pop')
        .append('g')
        .attr('class', 'brush')
        .datum({
            scale: xPopGrowthScale,
            attr_name: 'pop_growth'
        })
    .call(brush);

    for (var k=0; k<groupedLand.length; k++) {
        var landHistoData = groupedLand[k].sort(function(x, y){
                return d3.descending(x.land_2010, y.land_2010);
        });

        svg.selectAll('.circles land')
            .data(landHistoData)
            .enter()
            .append('circle')
            .attr('class', function(d, i) {
                return 'circles ' + chartNames[1];
            })
            .attr('cx', function(d) {
                return xLandGrowthScale(landHistoData['x0']) + histogramWidth*3-33;
            })
            .attr('cy', function(d, i) {
                return histogramHeight - (i*4.3)-2;
            })
            .attr('r', function (d) {
                return 2;
            })
            .style('fill', function (d, i) {
                return quantizeScaleLand(landHistoData[i]["land_2010"]);
            })
    }
    svg.select('#land')
        .append('g')
        .attr('class', 'brush')
        .datum({
            scale: xLandGrowthScale,
            attr_name: 'land_growth'
        })
    .call(brush);

    //X & Y axis placement for each histogram 
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", 'translate('+[histogramWidth - histoPadding.l*3 - histoPadding.r*3 - 10, (histogramHeight)]+')')
        .call(d3.axisBottom(xDensityGrowthScale).ticks(6, "%"));

    svg.append("g")
        .attr("class", "y-axis")
        .attr('transform', 'translate('+[(barChartWidth - histoPadding.l*3) - (barPadding.l/2)]+')')
        .call(d3.axisLeft(yDensityGrowthScale).ticks(7).tickSize(-histogramWidth).tickSizeOuter(0));

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", 'translate('+[(histogramWidth*2 - histoPadding.l*2 - histoPadding.r*2 - 5), (histogramHeight)]+')')
        .call(d3.axisBottom(xPopGrowthScale).ticks(6, "%"));

    svg.append("g")
        .attr("class", "y-axis")
        .attr('transform', 'translate('+[(barChartWidth*2 - histoPadding.l*2) - (barPadding.l/2) + 55]+')')
        .call(d3.axisLeft(yPopGrowthScale).ticks(7).tickSize(-histogramWidth).tickSizeOuter(0));

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", 'translate('+[(histogramWidth*3 - histoPadding.l - histoPadding.r*2 + 15), (histogramHeight)]+')')
        .call(d3.axisBottom(xLandGrowthScale).ticks(5, "%"));

    svg.append("g")
        .attr("class", "y-axis")
        .attr('transform', 'translate('+[(barChartWidth*3 - histoPadding.l*2) - (barPadding.l/2) + 125]+')')
        .call(d3.axisLeft(yLandGrowthScale).ticks(7).tickSize(-histogramWidth).tickSizeOuter(0));        








    svg.selectAll('.barcharts')
        .data(['A', 'B', 'C']) 
        .enter()
        .append('rect') 
        .attr('class', function (d,i) {
            return "barcharts " + chartNames[i];
        })
        .attr('width', barChartWidth)
        .attr('height', barChartHeight)
        .attr('transform', function(d, i) {
            var tx = 250 + (i % 3) * (barChartWidth + barPadding.l + barPadding.r) + barPadding.l;
            var ty = 10;
            return 'translate('+[tx, ty]+')';
        })       

    //Scales for each bar chart
    xDensityScale = d3.scaleLinear()
        .domain([0, maxDensity])
        .range([0, barChartWidth/1.65]);

    xPopScale = d3.scaleLinear()
        .domain([0, maxPop])
        .range([0, barChartWidth/1.65]);
    
    xLandScale = d3.scaleLinear()
        .domain([0, maxLand])
        .range([0, barChartWidth/1.65]);   

    //X axis placement for each bar chart
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate('+[barChartWidth + 85, (barChartHeight+40) - barPadding.b]+')')
        .call(d3.axisBottom(xDensityScale).ticks(6, "s"));

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate('+[(barChartWidth + 85)*2 - barPadding.l/2, (barChartHeight+40) - barPadding.b]+')')
        .call(d3.axisBottom(xPopScale).ticks(6, "s"));   

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate('+[(barChartWidth + 80)*3-5 - (barPadding.l/2), (barChartHeight+40) - barPadding.b]+')')
        .call(d3.axisBottom(xLandScale).ticks(6, "s")); 
   

    //Labels for each bar chart
    svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate('+[barChartWidth + 260, 28]+')')
        .text('Avg. population density (in persons/sq. km)');

    svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate('+[(barChartWidth*2 + 260)-10 , 28]+')')
        .text('Urban population');

    svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate('+[(barChartWidth*3 + 260)+70, 28]+')')
        .text('Urban land (in sq. km)');   

    //Y Labels for each histogram
    svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate('+[histogramWidth-130, histogramHeight-110]+') rotate(270)')
        .text('Number of Cities');  

    svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate('+[histogramWidth*2-90, histogramHeight-110]+') rotate(270)')
        .text('Number of Cities'); 

    svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate('+[histogramWidth*3-55, histogramHeight-110]+') rotate(270)')
        .text('Number of Cities'); 

    //Lebels for each histogram  
    svg.append('text')
        .attr('class', 'histo-label')
        .attr('transform', 'translate('+[histogramWidth+30, histogramHeight-260]+')')
        .append('tspan')
        .attr('x', 0)
        .attr('dy', '1.2em')
        .text('Growth in avg. population density')
        .append('tspan')
        .attr('x', 0)
        .attr('dy', '1.2em')
        .text('between 2000 and 2010');

    svg.append('text')
        .attr('class', 'histo-label')
        .attr('transform', 'translate('+[(histogramWidth+30)*2, histogramHeight-260]+')')
        .append('tspan')
        .attr('x', 0)
        .attr('dy', '1.2em')
        .text('Growth in population')
        .append('tspan')
        .attr('x', 0)
        .attr('dy', '1.2em')
        .text('between 2000 and 2010');     

    svg.append('text')
        .attr('class', 'histo-label')
        .attr('transform', 'translate('+[(histogramWidth+30)*3, histogramHeight-260]+')')
        .append('tspan')
        .attr('x', 0)
        .attr('dy', '1.2em')
        .text('Growth in urban land')
        .append('tspan')
        .attr('x', 0)
        .attr('dy', '1.2em')
        .text('between 2000 and 2010'); 

    //Legends for each histogram
    svg.append('text')
        .attr('class', 'histo-legend')
        .attr('transform', 'translate('+[histogramWidth+230, histogramHeight-175]+')')
        .text('Urban density - 2010');

    for (var i=1; i<4; i++) {
        for (var j=0; j<4; j++) {
            svg.append('rect')
                .attr('class', 'rect-legend')
                .attr('transform', 'translate('+[(histogramWidth*i+110)+(i*40), histogramHeight-115-(j*15)]+')')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', function (d) {
                    return valueColors[j];
                });
        }  
    }  

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[histogramWidth+170, histogramHeight-149]+')')
        .text('> 15k');

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[histogramWidth+170, histogramHeight-134]+')')
        .text('10k-15k');   

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[histogramWidth+170, histogramHeight-118]+')')
        .text('5k-10k'); 

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[histogramWidth+170, histogramHeight-104]+')')
        .text('< 5k');  

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(histogramWidth+170)*2-130, histogramHeight-149]+')')
        .text('> 4M');

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(histogramWidth+170)*2-130, histogramHeight-134]+')')
        .text('3M-4M');   

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(histogramWidth+170)*2-130, histogramHeight-118]+')')
        .text('2M-3M'); 

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(histogramWidth+170)*2-130, histogramHeight-104]+')')
        .text('< 2M'); 

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(histogramWidth+170)*3-260, histogramHeight-149]+')')
        .text('> 0.8k');

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(histogramWidth+170)*3-260, histogramHeight-134]+')')
        .text('0.6k-0.8k');   

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(histogramWidth+170)*3-260, histogramHeight-118]+')')
        .text('0.4k-0.6k'); 

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(histogramWidth+170)*3-260, histogramHeight-104]+')')
        .text('< 0.4k');    


    svg.append('text')
        .attr('class', 'histo-legend')
        .attr('transform', 'translate('+[(histogramWidth+135)*2, histogramHeight-175]+')')
        .text('Urban population - 2010'); 
        
    svg.append('text')
        .attr('class', 'histo-legend')
        .attr('transform', 'translate('+[(histogramWidth+102)*3, histogramHeight-175]+')')
        .text('Urban land - 2010');       
                   





    //Creation of Y axis (countries) for each bar chart
    var densityCountries = svg.selectAll('.countries density')
        .data(densityBarData, function(d){
            return d.key; 
        })

    var densityCountryEnter = densityCountries.enter()
        .append('g')
        .attr('class', 'countries density')
        .attr('transform', function(d,i) {
            return 'translate('+[barChartWidth-15, i * barBand + 4]+')';
        });

    var popCountries = svg.selectAll('.countries pop')
        .data(popBarData, function(d){
            return d.key; 
        })

    var popCountryEnter = popCountries.enter()
        .append('g')
        .attr('class', 'countries pop')
        .attr('transform', function(d,i) {
            return 'translate('+[barChartWidth*2+50, i * barBand + 4]+')';
        });

    var landCountries = svg.selectAll('.countries land')
        .data(landBarData, function(d){
            return d.key; 
        })

    var landCountryEnter = landCountries.enter()
        .append('g')
        .attr('class', 'countries land')
        .attr('transform', function(d,i) {
            return 'translate('+[barChartWidth*3+115, i * barBand + 4]+')';
        });    

    //Creation of bars for each bar chart
    densityCountryEnter.append('rect')
        .attr('fill', yearColors["2000"])
        .attr('height', barHeight)
        .attr('width', function(d){
            return xDensityScale(d.value.density_2000);
        })
        .attr('x', 100)
        .attr('y', 38.3)  
        .on('mouseover', function(d) {
            svg.selectAll('.countries')
                .attr('opacity', function(x) {
                    return x.key == d.key ? 1 : 0.25;
                })
            svg.selectAll('.circles')
                .attr('opacity', function(x) {
                    return x.country == d.key ? 1 : 0.25;
                }) 
        })  
        .on('mouseout', function(d) {
            svg.selectAll('.countries')
                .attr('opacity', 1)
            svg.selectAll('.circles')
                .attr('opacity', 1)       

        })

    densityCountryEnter.append('rect')
        .attr('fill', yearColors["2010"])
        .attr('height', barHeight)
        .attr('width', function(d){
            return xDensityScale(d.value.density_2010);
        })
        .attr('x', 100)
        .attr('y', 42.7)
        .on('mouseover', function(d) {
            svg.selectAll('.countries')
                .attr('opacity', function(x) {
                    return x.key == d.key ? 1 : 0.25;
                })
            svg.selectAll('.circles')
                .attr('opacity', function(x) {
                    return x.country == d.key ? 1 : 0.25;
                })   
        })  
        .on('mouseout', function(d) {
            svg.selectAll('.countries')
                .attr('opacity', 1)
            svg.selectAll('.circles')
                .attr('opacity', 1)
        })  

    popCountryEnter.append('rect')
        .attr('fill', yearColors["2000"])
        .attr('height', barHeight)
        .attr('width', function(d){
            return xPopScale(d.value.pop_2000);
        })
        .attr('x', 100)
        .attr('y', 38.3) 
        .on('mouseover', function(d) {
            svg.selectAll('.countries')
                .attr('opacity', function(x) {
                    return x.key == d.key ? 1 : 0.25;
                })
            svg.selectAll('.circles')
                .attr('opacity', function(x) {
                    return x.country == d.key ? 1 : 0.25;
                })   
        })  
        .on('mouseout', function(d) {
            svg.selectAll('.countries')
                .attr('opacity', 1)
            svg.selectAll('.circles')
                .attr('opacity', 1)
        })   

    popCountryEnter.append('rect')
        .attr('fill', yearColors["2010"])
        .attr('height', barHeight)
        .attr('width', function(d){
            return xPopScale(d.value.pop_2010);
        })
        .attr('x', 100)
        .attr('y', 42.7)
        .on('mouseover', function(d) {
            svg.selectAll('.countries')
                .attr('opacity', function(x) {
                    return x.key == d.key ? 1 : 0.25;
                })
            svg.selectAll('.circles')
                .attr('opacity', function(x) {
                    return x.country == d.key ? 1 : 0.25;
                })  
        })  
        .on('mouseout', function(d) {
            svg.selectAll('.countries')
                .attr('opacity', 1)
            svg.selectAll('.circles')
                .attr('opacity', 1)
        })

    landCountryEnter.append('rect')
        .attr('fill', yearColors["2000"])
        .attr('height', barHeight)
        .attr('width', function(d){
            return xLandScale(d.value.land_2000);
        })
        .attr('x', 100)
        .attr('y', 38.3)
        .on('mouseover', function(d) {
            svg.selectAll('.countries')
                .attr('opacity', function(x) {
                    return x.key == d.key ? 1 : 0.25;
                })
            svg.selectAll('.circles')
                .attr('opacity', function(x) {
                    return x.country == d.key ? 1 : 0.25;
                })   
        })  
        .on('mouseout', function(d) {
            svg.selectAll('.countries')
                .attr('opacity', 1)
            svg.selectAll('.circles')
                .attr('opacity', 1)
        })    

    landCountryEnter.append('rect')
        .attr('fill', yearColors["2010"])
        .attr('height', barHeight)
        .attr('width', function(d){
            return xLandScale(d.value.land_2010);
        })
        .attr('x', 100)
        .attr('y', 42.7)
        .on('mouseover', function(d) {
            svg.selectAll('.countries')
                .attr('opacity', function(x) {
                    return x.key == d.key ? 1 : 0.25;
                })
            svg.selectAll('.circles')
                .attr('opacity', function(x) {
                    return x.country == d.key ? 1 : 0.25;
                }) 
        })  
        .on('mouseout', function(d) {
            svg.selectAll('.countries')
                .attr('opacity', 1)
            svg.selectAll('.circles')
                .attr('opacity', 1)
        })          

    //Creation of y axis text for each bar chart
    densityCountryEnter.append('text')
        .attr('x', 92)
        .attr('dy', '3.5em')
        .attr("font-size", "13px")
        .attr('class', 'bar-text')
        .text(function(d){
            return d.key;
        });

    popCountryEnter.append('text')
        .attr('x', 92)
        .attr('dy', '3.5em')
        .attr("font-size", "13px")
        .attr('class', 'bar-text')
        .text(function(d){
            return d.key;
        });

    landCountryEnter.append('text')
        .attr('x', 92)
        .attr('dy', '3.5em')
        .attr("font-size", "13px")
        .attr('class', 'bar-text')
        .text(function(d){
            return d.key;
        });    
});

function brushstart() {
    if(brushCell !== this) {
        brush.move(d3.select(brushCell), null);
        brushCell = this;
    }
}

function brushmove(a) {
    var e = d3.event.selection;
    if(e) {
        svg.selectAll(".circles")
            .classed("hidden", function(d){
                return e[0] > (a.scale)(d[a.attr_name]) || (a.scale)(d[a.attr_name]) > e[1]
            })
    }
}

function brushend() {
    if(!d3.event.selection) {
        svg.selectAll('.hidden').classed('hidden', false);
        brushCell = undefined;
    }
}





