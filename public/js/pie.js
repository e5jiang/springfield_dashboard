Highcharts.chart('pie_chart', {
    chart: {
        type: 'pie'
    },
    title: {
        text: '2016-2019 Revenue Breakdown'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: "Revenue (USD)",
        data: [
        {
            name: 'Hamburgers',
            y: 317267030,
            color:  '#27251F'
        },
        {
            name: 'Chicken Fillets',
            y: 132154618,
            color: "#DA291C"
        },
        {
            name: 'Fish Fillets',
            y: 79426764,
            color: "#FFC72C"
        }]
    }]
});