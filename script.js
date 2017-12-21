d3.select(window).on('load', init);

function init() {

  d3.csv('data.csv', (error, dataMap) => {
    if (error) throw error;

    const svg = d3.select('#plot2');
    const width = parseFloat(svg.node().style.width);
    const height = parseFloat(svg.node().style.height);
    const formatter = d3.format("04");

    const padding = 30;
    const to_double = (n) => Number(n) > 50 ? null : Number(n);

    const average = (row) => {
        const xs = [to_double(row['JAN']), to_double(row['FEB']),
            to_double(row['MAR']), to_double(row['APR']), to_double(row['MAY']),
            to_double(row['JUN']), to_double(row['JUL']), to_double(row['AUG']),
            to_double(row['SEP']), to_double(row['OCT']), to_double(row['NOV']),
            to_double(row['DEC'])]
        if (xs.indexOf(null) > -1) {
            return null
        } else {
            return xs.reduce((x, y) => x + y, 0) / 12
        }
    }

    const data = dataMap.map(row => [row['YEAR'], average(row)])
                        .filter(r => r[1] < 50 && r[1] !== null)

    // Plot 1: Average temperatures
    const xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[0]), d3.max(data, d => d[0])])
    .range([padding,width-padding]);

    const yScale = d3.scaleLinear()
    .domain([0, 15])
    .range([height-padding, padding]);

    const line = d3.line().x(a => xScale(a[0])).y(a => yScale(a[1]))

    d3.select("#plot2")
        .append("path")
        .attr('stroke-width', 2)
        .attr('fill', "transparent")
        .attr('stroke', 'black')
        .attr('d', line(data))

    d3.select("#plot2")
        .append('g')
        .attr('transform', 'translate(0,' + (height - padding) + ')')
        .call(d3.axisBottom(xScale).ticks(4).tickFormat(formatter));
    d3.select("#plot2")
        .append('g')
        .attr('transform', 'translate('+padding+', 0)')
        .call(d3.axisLeft(yScale));

    // Plot 2: Histogram of average temperatures
    const bins = d3.histogram()
                   .domain([d3.min(data, d => d[1]), d3.max(data, d => d[1])])
                   .thresholds(yScale.ticks(200))(data.map(d => d[1]));
    const xBinScale = d3.scaleLinear()
        .domain([d3.min(bins.map(d => d.x0)), d3.max(bins.map(d => d.x1))])
        .rangeRound([padding, width - padding]);
    const yBinScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height - padding, padding]);
    const bars = d3.select("#plot3")
        .selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("transform", d => "translate(" + xBinScale(d.x0) + "," + yBinScale(d.length) + ")")

    bars.attr("x", 3)
        .attr("width", d => Math.max(15, xBinScale(d.x1) - xBinScale(d.x0) - 5))
        .attr("height", d => height - yBinScale(d.length) - padding)
    d3.select("#plot3")
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(d3.axisBottom(xBinScale));
  });
}
