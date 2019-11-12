var column_fish = Highcharts.chart('column_fish', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Cumulative Fish Fillet Sales',
        style: {
            "font-size": 16
        }
    },
    
    data: {
        csvURL: 'https://raw.githubusercontent.com/e5jiang/mcdonalds-viz/master/data_files/fish_dow.csv'
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
            color: "#FFC72C"
        }
    },

});