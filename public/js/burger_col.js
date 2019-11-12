var column_burger = Highcharts.chart('column_burger', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Cumulative Hamburger Sales',
        style: {
            "font-size": 16
        }
    },
    
    data: {
        csvURL: 'https://raw.githubusercontent.com/e5jiang/mcdonalds-viz/master/data_files/burgers_dow.csv'
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
            color: "#27251F"
        }
    },

});