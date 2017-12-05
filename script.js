d3.select(window).on('load', init);

function init() {

  d3.csv(
    'data.csv',
    function(error, dataMap) {
      if (error) throw error;

      const svg = d3.select('#plot1');
      const width = parseFloat(svg.node().style.width);
      const height = parseFloat(svg.node().style.height);

      const padding = 10;

      const data = dataMap.map(row => [row['YEAR'], row['J-J-A']])
                          .filter(r => r[1] < 50)

      const xScale = d3.scaleBand()
        .domain([d3.min(data, d => d[0]), d3.max(data, d => d[0])])
        .range([padding,width-padding]);

      const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[1]),
                 d3.max(data, d => d[1])])
        .range([height-padding, padding]);

        console.log(xScale(1900))

      d3.select("#plot1")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", "4px")
        .attr("cx", d => xScale(d[0]) + "px")
        .attr("cy", d => yScale(d[1]) + "px")
        //.attr("width", xScale.bandwidth() + "px")
        //.attr("height", d => height - yScale(d[1]) + "px");
  });
}
