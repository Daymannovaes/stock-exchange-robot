$(document).ready(function(undefined) {
	"use strict";

    var $filter = $("#filter");

    $filter.find("#build").click(function() {
        var stock = $filter.find("#stock").val().toLowerCase();
        var period = parseInt($filter.find("#period").val());

        $.get("/sma?stock=" + stock + "&period=" + period, function() {
            console.log("done");
        });
    });
    
    $filter.find("#search").click(function() {
        var stock = $filter.find("#stock").val().toLowerCase();
        var period = parseInt($filter.find("#period").val());
        var mini = $filter.find("#mini").is(":checked");

        var url = "public/candles/candles_ibov_" + stock;
        if(mini)
            url += "_mini";

        if(!isNaN(period) && period)
            url += "_period" + period;

        url += ".txt";

        $.get(url, function(data) {
            data = data.substr(0, data.length-2) + "]";
            $('#container').highcharts('StockChart', {
                rangeSelector : {
                    selected : 1
                },

                title : {
                    text : stock
                },
                series : [{
                    name : period,
                    data : JSON.parse(data), //array of arrays
                    tooltip: {
                        valueDecimals: 2
                    },
                    turboThreshold: 0
                }]
            });
        });
    });
})

/*
        $.get("public/candles/candles_ibov_itub4_mini_period30.txt", function(data1) {
        $.get("public/candles/candles_ibov_itub4_mini_period50.txt", function(data2) {
            data1 = data1.substr(0, data1.lastIndexOf(",")) + "]";
            data2 = data2.substr(0, data2.lastIndexOf(",")) + "]";
            $('#container').highcharts('StockChart', {
                rangeSelector : {
                    selected : 1
                },

                title : {
                    text : 'itub4'
                },
                series : [{
                    name : '20',
                    data : JSON.parse(data1), //array of arrays
                    tooltip: {
                        valueDecimals: 2
                    },
                    turboThreshold: 0
                },
{
                    name : '300',
                    data : JSON.parse(data2), //array of arrays
                    tooltip: {
                        valueDecimals: 2
                    },
                    turboThreshold: 0
                }]
            });
        });
    });
*/