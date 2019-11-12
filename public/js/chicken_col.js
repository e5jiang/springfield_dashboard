var column_chicken = Highcharts.chart('column_chicken', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Cumulative Chicken Fillet Sales',
        style: {
            "font-size": 16
        }
    },
    
    data: {
        csvURL: 'https://raw.githubusercontent.com/e5jiang/mcdonalds-viz/master/data_files/chicken_dow.csv'
    },

    yAxis: {
        title: {
            text: 'Revenue (USD)'
        }
    },

    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0,
            color: "#DA291C"
        }
    },

});