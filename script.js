d3.select(window).on('load', init);

function init() {

  d3.csv(
    'data.csv',
    function(error, dataMap) {
      if (error) throw error;

      const svg = d3.select('#plot1');
      const width = parseFloat(svg.node().style.width);
      const height = parseFloat(svg.node().style.height);

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

      const data = dataMap.map(row => [row['YEAR'], row['J-J-A'], average(row)])
                          .filter(r => r[1] < 50 && r[2] !== null)

      const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[0]), d3.max(data, d => d[0])])
        .range([padding,width-padding]);

      const yScale = d3.scaleLinear()
        .domain([0, 15])
        .range([height-padding, padding]);

      d3.select("#plot1")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("color", "#222266")
        .attr("r", "3px")
        .attr("cx", d => xScale(d[0]) + "px")
        .attr("cy", d => yScale(d[2]) + "px")

      var formatter = d3.format("04");

      d3.select("#plot1")
        .append('g')
        .attr('transform', 'translate(0,' + (height - padding) + ')')
        .call(d3.axisBottom(xScale).ticks(4).tickFormat(formatter));
      d3.select("#plot1")
        .append('g')
        .attr('transform', 'translate('+padding+', 0)')
        .call(d3.axisLeft(yScale));

      const line = d3.line()
        .x(a => xScale(a[0]))
        .y(a => yScale(a[2]))
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

  });
}
