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

var hBarPadding = {t: 40, r: 25, b: 60, l: 40};
var brushLinkPadding = {t: 40, r: 15, b: 60, l: 20};

var chartNames = ["density", "pop", "land"];

hChartWidth = svgWidth / 3.7 - hBarPadding.l - hBarPadding.r;
hChartHeight = svgHeight / 1.45 - hBarPadding.t - hBarPadding.b;

brushChartWidth = svgWidth / 3.4 - hBarPadding.l - hBarPadding.r;
brushChartHeight = svgHeight / .92 - hBarPadding.t - hBarPadding.b;

var hBarLine = hChartHeight / 22;
var hBarHeight = 4;


//Colors
var genderColors = {male: '#8c8c8c', female: '#d86763'};
var brushColors = ['#fcc9b5','#fa8873','#d44951','#843540']; //var brushColors = ['#fcc9b5','#fa8873','#d44951','#843540'];

//Brush for graphs.
var brush = d3.brushX()
    .extent([[0, 0], [brushChartWidth, brushChartHeight]])
    .on("start", brushstart)
    .on("brush", brushmove)
    .on("end", brushend);

var brushCell;    

d3.csv('./data/candy.csv',
function(row){
    //Formats each row of data.
    return {
    	gender: row.Q2_GENDER,
    	age: row.Q3_AGE,
    	country: row.Q4_COUNTRY,
    	fullCandy: row.Q6_Any_full_sized_candy_bar,
    	butterfinger: row.Q6_Butterfinger,
    	candyCorn: row.Q6_Candy_Corn,
    	chiclets: row.Q6_Chiclets,
    	dots: row.Q6_Dots,
    	fuzzyPeach: row.Q6_Fuzzy_Peaches,
    	goodPlenty: row.Q6_Good_N_Plenty,
    	gummyBears: row.Q6_Gummy_Bears_straight_up,
    	healthyFruit: row.Q6_Healthy_Fruit,
    	heathBar: row.Q6_Heath_Bar,
    	darkHersh: row.Q6_Hershey_s_Dark_Chocolate,
    	milkHersh: row.Q6_Hershey_s_Milk_Chocolate,
    	kissHersh: row.Q6_Hershey_s_Kisses,
    	jollyRanchBad: row.Q6_Jolly_Rancher_bad_flavor,
    	jollyRanchGood: row.Q6_Jolly_Ranchers_good_flavor,
    	juniorMints: row.Q6_Junior_Mints,
    	kitKat: row.Q6_Kit_Kat,
    	laffyTaffy: row.Q6_LaffyTaffy,
    	lemonHeads: row.Q6_LemonHeads,
    	notBlackLic: row.Q6_Licorice_not_black,
    	blackLic: row.Q6_Licorice_yes_black,
    	lollipops: row.Q6_Lollipops,
    	mikeIke: row.Q6_Mike_and_Ike,
    	milkDuds: row.Q6_Milk_Duds,
    	milkyWay: row.Q6_Milky_Way,
    	mmsReg: row.Q6_Regular_M_Ms,
    	mmsPeanut: row.Q6_Peanut_M_M_s,
    	mintKiss: row.Q6_Mint_Kisses,
    	goodBar: row.Q6_Mr_Goodbar,
    	nerds: row.Q6_Nerds,
    	nCrunch: row.Q6_Nestle_Crunch,
    	peeps: row.Q6_Peeps,
    	pixystix: row.Q6_Pixy_Stix,
    	rpButterCup: row.Q6_Reese_s_Peanut_Butter_Cups,
    	reesePiece: row.Q6_Reese_s_Pieces,
    	rolos: row.Q6_Rolos,
    	skittles: row.Q6_Skittles,
    	snickers: row.Q6_Snickers,
    	sourpatch: row.Q6_Sourpatch_Kids_i_e_abominations_of_nature,
    	starburst: row.Q6_Starburst,
    	swedishFish: row.Q6_Swedish_Fish,
    	ticTac: row.Q6_Tic_Tacs,
    	threeMusk: row.Q6_Three_Musketeers,
    	tolber: row.Q6_Tolberone_something_or_other,
    	trailMix: row.Q6_Trail_Mix,
    	twix: row.Q6_Twix,
    	whatcha: row.Q6_Whatchamacallit_Bars,
    	yorkPatties: row.Q6_York_Peppermint_Patties
    }
},
function(error, dataset){
    if(error) {
        console.error('An error occurred while loading ./data/candy.csv dataset.');
        console.error(error);
        return;
    }

    var hBarChartNest = d3.nest()
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
    var densityBarData = hBarChartNest.slice(0).sort(function(x, y){
        return d3.descending(x.value.density_2010, y.value.density_2010);
    })

    var popBarData = hBarChartNest.slice(0).sort(function(x, y){
        return d3.descending(x.value.pop_2010, y.value.pop_2010);
    })

    var landBarData = hBarChartNest.slice(0).sort(function(x, y){
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
        .attr('width', brushChartWidth)
        .attr('height', brushChartHeight)
        .attr('transform', function(d, i) {
            var tx = 230 + (i % 3) * (brushChartWidth + brushLinkPadding.l + brushLinkPadding.r) + brushLinkPadding.l;
            var ty = 10;
            return 'translate('+[tx, ty]+')';
        }) 

    //Scales for each histogram
    xDensityGrowthScale = d3.scaleLinear()
        .range([0, brushChartWidth])
        .domain(densityExtent);

    yDensityGrowthScale = d3.scaleLinear()
        .domain([0,155])
        .range([brushChartHeight,10]); 

    xPopGrowthScale = d3.scaleLinear()
        .range([0, brushChartWidth])
        .domain(popExtent);

    yPopGrowthScale = d3.scaleLinear()
        .domain([0,155])
        .range([brushChartHeight,10]);

    xLandGrowthScale = d3.scaleLinear()
        .range([0, brushChartWidth])
        .domain(landExtent);

    yLandGrowthScale = d3.scaleLinear()
        .domain([0,155])
        .range([brushChartHeight,10]);            

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
        .range(brushColors); 

    quantizeScalePop = d3.scaleQuantize()
        .domain([300000, 4000000])
        .range(brushColors); 

    quantizeScaleLand = d3.scaleQuantize()
        .domain([60, 800])
        .range(brushColors);                  

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
                return xDensityGrowthScale(densityHistoData['x0']) + brushChartWidth-113;
            })
            .attr('cy', function(d, i) {
                return brushChartHeight - (i*4.3)-2;
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
                return xPopGrowthScale(popHistoData['x0']) + brushChartWidth*2-73;
            })
            .attr('cy', function(d, i) {
                return brushChartHeight - (i*4.3)-2;
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
                return xLandGrowthScale(landHistoData['x0']) + brushChartWidth*3-33;
            })
            .attr('cy', function(d, i) {
                return brushChartHeight - (i*4.3)-2;
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

    //X & Y axis placement for brush/link charts.
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", 'translate('+[brushChartWidth - brushLinkPadding.l*3 - brushLinkPadding.r*3 - 10, (brushChartHeight)]+')')
        .call(d3.axisBottom(xDensityGrowthScale).ticks(6, "%"));

    svg.append("g")
        .attr("class", "y-axis")
        .attr('transform', 'translate('+[(hChartWidth - brushLinkPadding.l*3) - (hBarPadding.l/2)]+')')
        .call(d3.axisLeft(yDensityGrowthScale).ticks(7).tickSize(-brushChartWidth).tickSizeOuter(0));

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", 'translate('+[(brushChartWidth*2 - brushLinkPadding.l*2 - brushLinkPadding.r*2 - 5), (brushChartHeight)]+')')
        .call(d3.axisBottom(xPopGrowthScale).ticks(6, "%"));

    svg.append("g")
        .attr("class", "y-axis")
        .attr('transform', 'translate('+[(hChartWidth*2 - brushLinkPadding.l*2) - (hBarPadding.l/2) + 55]+')')
        .call(d3.axisLeft(yPopGrowthScale).ticks(7).tickSize(-brushChartWidth).tickSizeOuter(0));

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", 'translate('+[(brushChartWidth*3 - brushLinkPadding.l - brushLinkPadding.r*2 + 15), (brushChartHeight)]+')')
        .call(d3.axisBottom(xLandGrowthScale).ticks(5, "%"));

    svg.append("g")
        .attr("class", "y-axis")
        .attr('transform', 'translate('+[(hChartWidth*3 - brushLinkPadding.l*2) - (hBarPadding.l/2) + 125]+')')
        .call(d3.axisLeft(yLandGrowthScale).ticks(7).tickSize(-brushChartWidth).tickSizeOuter(0));        

    svg.selectAll('.barcharts')
        .data(['A', 'B', 'C']) 
        .enter()
        .append('rect') 
        .attr('class', function (d,i) {
            return "barcharts " + chartNames[i];
        })
        .attr('width', hChartWidth)
        .attr('height', hChartHeight)
        .attr('transform', function(d, i) {
            var tx = 250 + (i % 3) * (hChartWidth + hBarPadding.l + hBarPadding.r) + hBarPadding.l;
            var ty = 10;
            return 'translate('+[tx, ty]+')';
        })       

    //Scales for each bar chart
    xDensityScale = d3.scaleLinear()
        .domain([0, maxDensity])
        .range([0, hChartWidth/1.65]);

    xPopScale = d3.scaleLinear()
        .domain([0, maxPop])
        .range([0, hChartWidth/1.65]);
    
    xLandScale = d3.scaleLinear()
        .domain([0, maxLand])
        .range([0, hChartWidth/1.65]);   

    //X-axis for horizontal bar charts.
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate('+[hChartWidth + 85, (hChartHeight+40) - hBarPadding.b]+')')
        .call(d3.axisBottom(xDensityScale).ticks(6, "s"));

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate('+[(hChartWidth + 85)*2 - hBarPadding.l/2, (hChartHeight+40) - hBarPadding.b]+')')
        .call(d3.axisBottom(xPopScale).ticks(6, "s"));   

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate('+[(hChartWidth + 80)*3-5 - (hBarPadding.l/2), (hChartHeight+40) - hBarPadding.b]+')')
        .call(d3.axisBottom(xLandScale).ticks(6, "s")); 
   
    //Titles for horizontal bar charts.
    svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate('+[hChartWidth + 260, 28]+')')
        .text('Gender Distribution for Different Candies');

    svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate('+[(hChartWidth*2 + 260)-10 , 28]+')')
        .text('Maybe A Graph?');  

    //Y-axis label for brush/link charts.
    svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate('+[brushChartWidth-130, brushChartHeight-110]+') rotate(270)')
        .text('Number of Cities');  

    svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'translate('+[brushChartWidth*2-90, brushChartHeight-110]+') rotate(270)')
        .text('Number of Cities'); 

    //Titles for brush/link charts. 
    svg.append('text')
        .attr('class', 'histo-label')
        .attr('transform', 'translate('+[brushChartWidth+30, brushChartHeight-260]+')')
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
        .attr('transform', 'translate('+[(brushChartWidth+30)*2, brushChartHeight-260]+')')
        .append('tspan')
        .attr('x', 0)
        .attr('dy', '1.2em')
        .text('Growth in population')
        .append('tspan')
        .attr('x', 0)
        .attr('dy', '1.2em')
        .text('between 2000 and 2010');     

    //Legends for brush/link charts.
    svg.append('text')
        .attr('class', 'histo-legend')
        .attr('transform', 'translate('+[brushChartWidth+230, brushChartHeight-175]+')')
        .text('Urban density - 2010');

    for (var i=1; i<4; i++) {
        for (var j=0; j<4; j++) {
            svg.append('rect')
                .attr('class', 'rect-legend')
                .attr('transform', 'translate('+[(brushChartWidth*i+110)+(i*40), brushChartHeight-115-(j*15)]+')')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', function (d) {
                    return brushColors[j];
                });
        }  
    }  

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[brushChartWidth+170, brushChartHeight-149]+')')
        .text('> 15k');

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[brushChartWidth+170, brushChartHeight-134]+')')
        .text('10k-15k');   

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[brushChartWidth+170, brushChartHeight-118]+')')
        .text('5k-10k'); 

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[brushChartWidth+170, brushChartHeight-104]+')')
        .text('< 5k');  

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(brushChartWidth+170)*2-130, brushChartHeight-149]+')')
        .text('> 4M');

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(brushChartWidth+170)*2-130, brushChartHeight-134]+')')
        .text('3M-4M');   

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(brushChartWidth+170)*2-130, brushChartHeight-118]+')')
        .text('2M-3M'); 

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(brushChartWidth+170)*2-130, brushChartHeight-104]+')')
        .text('< 2M'); 

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(brushChartWidth+170)*3-260, brushChartHeight-149]+')')
        .text('> 0.8k');

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(brushChartWidth+170)*3-260, brushChartHeight-134]+')')
        .text('0.6k-0.8k');   

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(brushChartWidth+170)*3-260, brushChartHeight-118]+')')
        .text('0.4k-0.6k'); 

    svg.append('text')
        .attr('class', 'rect-text')
        .attr('transform', 'translate('+[(brushChartWidth+170)*3-260, brushChartHeight-104]+')')
        .text('< 0.4k');    


    svg.append('text')
        .attr('class', 'histo-legend')
        .attr('transform', 'translate('+[(brushChartWidth+135)*2, brushChartHeight-175]+')')
        .text('Urban population - 2010'); 
        
    svg.append('text')
        .attr('class', 'histo-legend')
        .attr('transform', 'translate('+[(brushChartWidth+102)*3, brushChartHeight-175]+')')
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
            return 'translate('+[hChartWidth-15, i * hBarLine + 4]+')';
        });

    var popCountries = svg.selectAll('.countries pop')
        .data(popBarData, function(d){
            return d.key; 
        })

    var popCountryEnter = popCountries.enter()
        .append('g')
        .attr('class', 'countries pop')
        .attr('transform', function(d,i) {
            return 'translate('+[hChartWidth*2+50, i * hBarLine + 4]+')';
        });

    var landCountries = svg.selectAll('.countries land')
        .data(landBarData, function(d){
            return d.key; 
        })

    var landCountryEnter = landCountries.enter()
        .append('g')
        .attr('class', 'countries land')
        .attr('transform', function(d,i) {
            return 'translate('+[hChartWidth*3+115, i * hBarLine + 4]+')';
        });    

    //Creation of bars for each bar chart
    densityCountryEnter.append('rect')
        .attr('fill', genderColors["2000"])
        .attr('height', hBarHeight)
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
        .attr('fill', genderColors["2010"])
        .attr('height', hBarHeight)
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
        .attr('fill', genderColors["2000"])
        .attr('height', hBarHeight)
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
        .attr('fill', genderColors["female"])
        .attr('height', hBarHeight)
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
        .attr('fill', genderColors["male"])
        .attr('height', hBarHeight)
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
        .attr('fill', genderColors["2010"])
        .attr('height', hBarHeight)
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





