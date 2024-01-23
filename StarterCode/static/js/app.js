// Place url in a constant variable
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Bar chart function
function BarChart(sample){
    console.log(`BarChart(${sample})`);

    // Use D3 to retrieve all of the data
    d3.json(url).then(data => {
        console.log(data);
        
        // Retrieve all data
        let samples = data.samples;
        // Filter based on the value of the sample
        let resultArray = samples.filter(s => s.id == sample);
        // Get the first index from the array
        let result = resultArray[0];

        // Get the otu_ids, labels, and sample values
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // Set up the trace for the chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        //Set up layout
        let layout = {
            title:"Top 10 OTUs Found",
            margin: {t: 30, l: 150}
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot('bar', [trace], layout);
    })
};

// Bubble chart function
function Bubblechart(sample){
    console.log(`Bubblechart(${sample})`);

    // Use D3 to retrieve all of the data
    d3.json(url).then(data => {
        
        //Retrieve all sample data
       let samples = data.samples;
       //Filter based on the value of the sample
       let resultArray = samples.filter(s => s.id == sample);
       //Get the first index from the array
       let result = resultArray[0];

       // Get the otu_ids, otu_labels and sample values
       let otu_ids = result.otu_ids;
       let otu_labels = result.otu_labels;
       let sample_values = result.samples_values;

       // Set up the trace for the chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth'
            }
        }

        // Set up layout
        let layout = {
            title: 'Bacteria cultures per Sample',
            hovermode: 'closest',
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot('bubble', [trace1], layout);
        })
    };

// Function that shows metadata info
function MetaData(sample){
    console.log(`ShowMetadata(${sample})`);

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        //Retrieve all metadata
        let metadata = data.metadata;
        console.log(metadata);
        // Filter based on the value of the sample
        let result = metadata.filter(meta => meta.id == sample)[0];
        let demographicInfo = d3.select('#sample-metadata');

        //Clear existing data in demographicInfo
        demographicInfo.html('');

        //Add key and value pair to the demograohicInfo panel
        Object.entries(result).forEach(([key, value]) => {
            demographicInfo.append('h6').text(`${key}: ${value}`);
        });
    });
}

function optionChanged(sample){
    console.log(`optionChanged, new value: ${sample}`);

    BarChart(sample);
    Bubblechart(sample);
    MetaData(sample);
}

function InitDashboard() {
    console.log('InitDashboard');

    // Get a handle to the dropdown
    let selector = d3.select('#selDataset');

    d3.json(url).then(data => {
        console.log('Here is the data');

        let sampleNames = data.names;
        console.log('Here are the sample names:', sampleNames);

        // Populate the dropdown
        for (let i =0; i < sampleNames.length; i++){
            let sample = sampleNames[i];
            selector.append('option').text(sample).property('value', sample);
        };

        // Read the current value from the dropdown
        let initialId = selector.property('value');
        console.log(`initialId = ${initialId}`);

        // Draw the bargraph for the selected sample 
        BarChart(initialId);
        // Bubblechart
        Bubblechart(initialId);
        // Metadata
        MetaData(initialId);

    });
}

InitDashboard();