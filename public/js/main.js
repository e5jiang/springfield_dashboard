/*
The purpose of this demo is to demonstrate how multiple charts on the same page
can be linked through DOM and Highcharts events and API methods. It takes a
standard Highcharts config with a small variation for each data set, and a
mouse/touch event handler to bind the charts together.
*/


/**
 * In order to synchronize tooltips and crosshairs, override the
 * built-in events with handlers defined on the parent element.
 */
/*['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
    document.getElementById('container').addEventListener(
        eventType,
        function (e) {
            var chart,
                point,
                i,
                event;

            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                // Find coordinates within the chart
                event = chart.pointer.normalize(e);
                // Get the hovered point
                point = chart.series[0].searchPoint(event, true);

                if (point) {
                    point.highlight(e);
                }
            }
        }
    );
});*/
$('#container').bind('mousemove touchmove touchstart', function (e) {
    var chart,
        point,
        i,
        event;
        
    // points container
    var points = [];

    for (i = 0; i < Highcharts.charts.length; i = i + 1) {
        chart = Highcharts.charts[i];
        event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
        point = chart.series[0].searchPoint(event, true); // Get the hovered point

        if (point) {
            point.onMouseOver(); // Show the hover marker

            // store points: 
            points.push(point);

            chart.xAxis[0].drawCrosshair(event, point); // Show the crosshair
        }
    }
    
    // use refresh([point_1, point_2, ... ]);
    chart.tooltip.refresh(points); // Show the tooltip
    
});
/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
/*Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};*/

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(
                        e.min,
                        e.max,
                        undefined,
                        false,
                        { trigger: 'syncExtremes' }
                    );
                }
            }
        });
    }
}


Highcharts.ajax({
    url: 'https://raw.githubusercontent.com/e5jiang/springfield_dashboard/master/data_files/springfield_converted.json',
    dataType: 'text',
    success: function (power) {

        var energyDiv = document.createElement('div');
        energyDiv.className = 'chart';
        document.getElementById('container').appendChild(energyDiv);

        var pie_vals = [];

        var area_options = {
            chart: {
                marginLeft: 40, // Keep all charts left aligned
                spacingTop: 20,
                spacingBottom: 20,
                type: 'area'
            },
            title: {
                text: "Generation MW",
                align: 'left',
                margin: 0,
                x: 30
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                labels: {
                  format: '{value:%Y-%b-%e}'
                },
                crosshair: true,
                events: {
                    setExtremes: syncExtremes
                },
                tickInterval: 24 * 3600 * 1000
            },

            yAxis: {
                title: {
                    text: null
                },
                reversedStacks: false
            },
            
            exporting: {
                enabled: false
            },

            tooltip: {
                positioner: function () {
                    return {
                        // right aligned
                        x: this.chart.chartWidth - this.label.width,
                        y: 10 // align to title
                    };
                },
                
                formatter: function () {
                    var s = '';
                
                    $.each(this.points, function(i, point) {
                        header = '<tr>' + '<th>Source</th>' + '<th>Power</th>' + '</tr>'; 
                        s += '<tr>' + '<td>'+ point.series.name + '</td>' +
                                '<td>' + this.y.toFixed(2) + '</td>' + '</tr>';
                    });
                    
                    $("#legend").html(header + s);
                    return Highcharts.dateFormat('%e %b, %I:%M %p', this.x) + ' | ' + 
                    this.y.toFixed(2);
                },

                borderWidth: 0,
                backgroundColor: 'none',
                headerFormat: '',
                shadow: false,
                style: {
                    fontSize: '12px'
                },
                shared: true
            },

            plotOptions: {
                series: {
                    pointStart: 1571578200000,
                    pointInterval: 30 * 60 * 1000,
                }
            },
        
            series: []
        };

        var priceDiv = document.createElement('div');
        priceDiv.className = 'chart';
        document.getElementById('container').appendChild(priceDiv);

        var price_options = {
            chart: {
                marginLeft: 40, // Keep all charts left aligned
                spacingTop: 20,
                spacingBottom: 20,
                type: 'line'
            },
            title: {
                text: "Price $/MWh",
                align: 'left',
                margin: 0,
                x: 30
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                labels: {
                  format: '{value:%Y-%b-%e}'
                },
                crosshair: true,
                events: {
                    setExtremes: syncExtremes
                },
                tickInterval: 24 * 3600 * 1000
            },

            yAxis: {
                title: {
                    text: null
                },
                reversedStacks: false
            },
            
            exporting: {
                enabled: false
            },

            tooltip: {
                positioner: function () {
                    return {
                        // right aligned
                        x: this.chart.chartWidth - this.label.width,
                        y: 10 // align to title
                    };
                },

                formatter: function () {
                    return Highcharts.dateFormat('%e %b, %I:%M %p', this.x) + ' | ' + 
                    Highcharts.numberFormat(this.y, 0);
                },

                borderWidth: 0,
                backgroundColor: 'none',
                headerFormat: '',
                shadow: false,
                style: {
                    fontSize: '12px'
                }
            },

            plotOptions: {
                series: {
                    pointStart: 1571578200000,
                    pointInterval: 30 * 60 * 1000
                }
            },
        
            series: []
        };

        var tempDiv = document.createElement('div');
        tempDiv.className = 'chart';
        document.getElementById('container').appendChild(tempDiv);

        var temp_options = {
            chart: {
                marginLeft: 40, // Keep all charts left aligned
                spacingTop: 20,
                spacingBottom: 20,
                type: 'line'
            },
            title: {
                text: "Temperature F",
                align: 'left',
                margin: 0,
                x: 30
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                labels: {
                  format: '{value:%Y-%b-%e}'
                },
                crosshair: true,
                events: {
                    setExtremes: syncExtremes
                },
                tickInterval: 24 * 3600 * 1000
            },

            yAxis: {
                title: {
                    text: null
                },
                reversedStacks: false
            },
            
            exporting: {
                enabled: false
            },

            tooltip: {
                positioner: function () {
                    return {
                        // right aligned
                        x: this.chart.chartWidth - this.label.width,
                        y: 10 // align to title
                    };
                },

                formatter: function () {
                    return Highcharts.dateFormat('%e %b, %I:%M %p', this.x) + ' | ' + 
                    Highcharts.numberFormat(this.y, 0) + '<br/>';
                },

                borderWidth: 0,
                backgroundColor: 'none',
                headerFormat: '',
                shadow: false,
                style: {
                    fontSize: '12px'
                }
            },

            plotOptions: {
                series: {
                    pointStart: 1571578200000,
                    pointInterval: 30 * 60 * 1000
                }
            },
        
            series: []
        };

        var pieDiv = document.createElement('div');
        pieDiv.className = 'chart';
        document.getElementById('pie_legend').appendChild(pieDiv);

        var pie_chart = Highcharts.chart(pieDiv, {
            chart: {
                type: 'pie'
            },
            title: {
                text: undefined
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            series: [{
                data: []
            }]
        });

        power = JSON.parse(power);
        power.forEach(function (dataset) {
            if (dataset.type == 'power' && dataset.fuel_tech !== 'exports') {
                var index = 336;
                var original = dataset.history.data;
                var area_arr = [];
                var delta = Math.floor(original.length/index);
                var total_arr = [];
                for (i = 0; i < original.length; i=i+delta) {
                    area_arr.push(original[i]);

                }
                area_options.series.push({
                    name: dataset.fuel_tech,
                    data: area_arr,
                    stacking: 'normal',
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    }
                });
            
            };
            
            if (dataset.type == 'price') {
                price_options.series.push({
                    name: 'Price',
                    data: dataset.history.data
                });
            };

            if (dataset.type == 'temperature') {
                temp_options.series.push({
                    name: 'Temp',
                    data: dataset.history.data
                });
            };
        });

        var total_arr = [];
        for (i = 0; i < area_options.series[0].data.length; i++) {
            var total = 0;
            for (j = 0; j < area_options.series.length; j++) {
                total += area_options.series[j].data[i];
            }
            total_arr.push(total);
        }
        area_options.series.unshift({
            name: 'total',
            data: total_arr,
            stacking: false,
            states: {
                hover: {
                    enabled: false
                }
            },
            fillOpacity: 0
        });

        $('#container').mouseover(function(){
            var pie_data = [];
            var legend_table = document.getElementById('legend');

            for (i = 2; i < legend_table.rows.length; i++) {
                var row_cells = legend_table.rows.item(i).cells;
                var sect = {
                    name: '',
                    y: 0
                };

                for (var j = 0; j < row_cells.length; j++){
                    var content = row_cells.item(j).innerHTML;
                
                    if (j == 0) {
                        sect['name'] = content;
                    }
                    else if (j == 1) {
                        sect['y'] = parseFloat(content);
                    }
                    else {
                        break;
                    }
                }
                pie_data.push(sect);
            }
            pie_chart.series[0].setData(pie_data);
        });

        Highcharts.chart(energyDiv, area_options);
        Highcharts.chart(priceDiv, price_options);
        Highcharts.chart(tempDiv, temp_options);
    }
});

            

