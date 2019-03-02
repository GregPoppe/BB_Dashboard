d3.json('/names').then(data => {
  console.log(data);

  d3.select('#selDataset')
    .selectAll('option')
    .data('data')
    .enter()
    .append('option')
    .text(r => r.SAMPLE)
    .attr('value', r => r.SAMPLE)


});




function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var dataDisplay = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    dataDisplay.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      dataDisplay.append("h6").text(`${key}: ${value}`);
    });

    // BONUS: Build the Gauge Chart
   // buildGauge(data.WFREQ);
  });
}




function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
      d3.json(`/samples/${sample}`).then((data) => {
        const otu_ids = data.otu_ids;
        const otu_labels = data.otu_labels;
        const sample_values = data.sample_values;
    
        // Build a Bubble Chart
        var bubbleLayout = {
          margin: { t: 0 },
          hovermode: "closest",
          xaxis: { title: "OTU ID" }
        };
        var bubbleData = [
          {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth"
            }
          }
        ];
    
        Plotly.plot("bubble", bubbleData, bubbleLayout);
    
        // Build a Pie Chart
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).
        var pieData = [
          {
            values: sample_values.slice(0, 10),
            labels: otu_ids.slice(0, 10),
            hovertext: otu_labels.slice(0, 10),
            hoverinfo: "hovertext",
            type: "pie"
          }
        ];
    
        var pieLayout = {
          margin: { t: 0, l: 0 }
        };
    
        Plotly.plot("pie", pieData, pieLayout);
      });
    }
    












function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// This is called every time the drop down changes
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log(`You must Selected ${newSample}`);

  buildCharts(newSample);
  buildMetadata(newSample);
  console.log(`You again Selected ${newSample}`);

}

// Initialize the dashboard
init();
