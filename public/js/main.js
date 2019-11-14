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
            exporting: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                series: {
                    enableMouseTracking: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
            },
            colors: ['#0d233a', '#8bbc21', '#910000', '#1aadce',
            '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
            legend: {
                enabled: false
            },
            series: [{
                data: []
            }]
        });

        var energyDiv = document.createElement('div');
        energyDiv.className = 'chart';
        document.getElementById('container').appendChild(energyDiv);

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
            colors: ['#FFFFFF','#FFFFFF', '#0d233a', '#8bbc21', '#910000', '#1aadce',
            '#f28f43', '#492970', '#77a1e5', '#c42525', '#a6c96a'],
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
                    var pie_data = [];
                    var total = 0;
                    var loads_header = '';   
                    var loads_s = '';
                    var legend_header = '';
                    var legend_s = ''; 
                    var net_s = '';
                    var legend_colors = ['#FFFFFF','#FFFFFF', '#0d233a', '#8bbc21', '#910000', '#1aadce',
                    '#f28f43', '#492970', '#77a1e5'];
                    $.each(this.points, function(i, point) {
                
                        var time = '<p>' + Highcharts.dateFormat('%e %b, %I:%M %p', this.x) + '</p>';
                        $("#date_time").html(time);

                        
                        if (point.series.name == 'Exports' || point.series.name == 'Pumps' || point.series.name == 'Net') {

                            if (point.series.name == 'Net') {
                                var percent = (parseFloat(this.y.toFixed(2))/total*100).toFixed(2) + '%';
                                net_s += '<tr>' + '<td></td>' +
                                '<td>'+ point.series.name + '</td>' +
                                '<td>' + this.y.toFixed(2) + '</td>' +
                                '<td>' + '</td>' + '</tr>';
                            }
                            else {
                                var percent = (parseFloat(this.y.toFixed(2))/total*100).toFixed(2) + '%';
                                loads_header = '<tr>' + '<th></th>' + '<th>Loads</th>' + '<th>Energy (MW)</th>' + 
                                '<th>Contribution (to demand)</th>' + '</tr>';
                                loads_s += '<tr>' +
                                '<td style="background-color: ' + legend_colors[i] +'"></td>' + 
                                '<td>'+ point.series.name + '</td>' +
                                '<td>' + this.y.toFixed(2) + '</td>' +
                                '<td>' + percent + '</td>' + '</tr>';
                            }
                        }
                        else {
                            
                            if (point.series.name == 'Total') {
                                total = parseFloat(this.y.toFixed(2));
                                var curr_total = '<b>Total: ' + total + ' MW</b>';
                                $("#total_div").html(curr_total);
                            }
                            else {
                                pie_data.push({
                                    name: point.series.name,
                                    y: parseFloat(this.y.toFixed(2))
                                });
                            }

                            if (point.series.name == 'distillate'){
                                var percent = (parseFloat(this.y.toFixed(2))/total*100).toFixed(4) + '%';
                            }
                            else if (point.series.name == 'Total'){
                                var percent = '';
                            }
                            else {
                                var percent = (parseFloat(this.y.toFixed(2))/total*100).toFixed(1) + '%';
                            }

                            legend_header = '<tr>' + '<th></th>' + '<th>Sources</th>' + '<th>Energy (MW)</th>' + 
                                            '<th>Contribution (to demand)</th>' + '</tr>';

                            legend_s += '<tr>' + 
                                    '<td style="background-color: ' + legend_colors[i] +'"></td>' + 
                                    '<td>'+ point.series.name + '</td>' +
                                    '<td>' + this.y.toFixed(2) + '</td>' +
                                    '<td>' + percent + '</td>' + '</tr>';

                            pie_chart.series[0].setData(pie_data);
                        };
                    });
                        
                    $("#legend").html(legend_header + legend_s);
                    $("#loads").html(loads_header + loads_s + net_s);
                    
                    return Highcharts.dateFormat('%e %b, %I:%M %p', this.x) + ' | ' + 
                    (this.y.toFixed(2) + ' MW').bold();

                        
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
                    marker: {
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    },
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
                    ('$' + Highcharts.numberFormat(this.y, 0) + '.00').bold();
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
                    marker: {
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    },
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
                text: 'Temperature ' + String.fromCharCode(176) + 'F',
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
                    (Highcharts.numberFormat(this.y, 0) + String.fromCharCode(176) + 'F').bold();
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
                    marker: {
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    },
                    pointStart: 1571578200000,
                    pointInterval: 30 * 60 * 1000
                }
            },
        
            series: []
        };

        /*var pieDiv = document.createElement('div');
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
            exporting: {
                enabled: false
            },
            colors: ['#0d233a', '#8bbc21', '#910000', '#1aadce',
            '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
            legend: {
                enabled: false
            },
            series: [{
                data: []
            }]
        });*/

        power = JSON.parse(power);
        var exports = [];
        var pumps = [];
        power.forEach(function (dataset) {
            if (dataset.type == 'power') {
                var index = 336;
                var original = dataset.history.data;
                var area_arr = [];
                var delta = Math.floor(original.length/index);
                for (i = 0; i < original.length; i=i+delta) {
                    area_arr.push(original[i]);

                }
                if (dataset.fuel_tech == 'exports') {
                    var negated_arr = area_arr.map(value => -value);
                    area_options.series.push({
                        name: 'Exports',
                        data: negated_arr,
                        stacking: false,
                        states: {
                            inactive: {
                                opacity: 1
                            }
                        }
                    });
                }
                else if (dataset.fuel_tech == 'pumps') {
                    var negated_arr = area_arr.map(value => -value);
                    area_options.series.push({
                        name: 'Pumps',
                        data: negated_arr,
                        stacking: false,
                        states: {
                            inactive: {
                                opacity: 1
                            }
                        }
                    });
                }
                else if (dataset.fuel_tech == 'black_coal') {
                    area_options.series.push({
                        name: 'Black Coal',
                        data: area_arr,
                        stacking: 'normal',
                        states: {
                            inactive: {
                                opacity: 1
                            }
                        }
                    });
                }
                else if (dataset.fuel_tech == 'distillate') {
                    area_options.series.push({
                        name: 'Distillate',
                        data: area_arr,
                        stacking: 'normal',
                        states: {
                            inactive: {
                                opacity: 1
                            }
                        }
                    });
                }
                else if (dataset.fuel_tech == 'gas_ccgt') {
                    area_options.series.push({
                        name: 'Gas (CCGT)',
                        data: area_arr,
                        stacking: 'normal',
                        states: {
                            inactive: {
                                opacity: 1
                            }
                        }
                    });
                }
                else if (dataset.fuel_tech == 'hydro') {
                    area_options.series.push({
                        name: 'Hydro',
                        data: area_arr,
                        stacking: 'normal',
                        states: {
                            inactive: {
                                opacity: 1
                            }
                        }
                    });
                }
                else {
                    area_options.series.push({
                        name: 'Wind',
                        data: area_arr,
                        stacking: 'normal',
                        states: {
                            inactive: {
                                opacity: 1
                            }
                        }
                    });
                }
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
        var net_arr = [];
        for (i = 0; i < area_options.series[0].data.length; i++) {
            var total = 0;
            var net = 0;
            for (j = 0; j < area_options.series.length; j++) {
                net += area_options.series[j].data[i];
                total += area_options.series[j].data[i];
                if (area_options.series[j].name == 'Exports' || area_options.series[j].name == 'Pumps') {
                    net += area_options.series[j].data[i];
                }
            }
            total_arr.push(total);
            net_arr.push(net);
        }
        area_options.series.unshift({
            name: 'Net',
            data: net_arr,
            stacking: false,
            states: {
                hover: {
                    enabled: false
                }
            },
            opacity: 0,
            fillOpacity: 0
        });

        area_options.series.unshift({
            name: 'Total',
            data: total_arr,
            stacking: false,
            states: {
                hover: {
                    enabled: false
                }
            },
            opacity: 0,
            fillOpacity: 0
        });

        /*$('#container').mouseover(function(){
            var pie_data = [];
            var legend_table = document.getElementById('legend');
            
            var total_row = legend_table.rows.item(1).cells;
            for (var t = 0; t < total_row.length; t++){
                if (t == 1) {
                    var curr_total = '<b>Total: ' + parseFloat(total_row.item(t).innerHTML) + ' MW</b>';
                    $("#total_div").html(curr_total);
                }
            }

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
        });*/

        Highcharts.chart(energyDiv, area_options);
        Highcharts.chart(priceDiv, price_options);
        Highcharts.chart(tempDiv, temp_options);
    }
});

            

