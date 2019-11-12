var fish_line = Highcharts.chart('fish_line', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Monthly Fish Fillet Sales by Region from 2016-2019'
    },

    data: {
        csvURL: 'https://raw.githubusercontent.com/e5jiang/mcdonalds-viz/master/data_files/fish.csv',
        beforeParse: function(csv) {
            return csv.replace(/\b(\d{2}[\W\D\S])([a-zA-Z]{3})\b/g, "01-$1$2");
        },
        parseDate: Date.parse
    },
    tooltip: {
        xDateFormat: "%b-%y"
    },
    yAxis: {
        title: {
            text: 'Revenue (USD)'
        }
    },
    xAxis: {
        type: 'datetime',
        labels: {
            format: '{value: %b-%y}',
            rotation: -20
        },
        plotLines: [{
            color: '#FF0000',
            width: 2,
            value: '1538377200000'
        }],
        tickInterval: 1000 * 3600 * 24 *30
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: 'XD'
    }]
});