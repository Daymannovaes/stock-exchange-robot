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
        var stock = "itub4";
        var periods = $filter.find("input[type='checkbox']:checked");

        var urlBase = "public/candles/candles_ibov_" + stock + "_mini_";

        var urls = [];
        periods.map(function(a, b){
            urls.push($.get(urlBase + b.name + ".txt"));
        });

        $.when.apply(this, urls).done();
        return;

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
$.when(
    $.get("public/candles/candles_ibov_itub4_mini_period30.txt"),
    $.get("public/candles/candles_ibov_itub4_mini_period200.txt"),
    $.get("public/candles/candles_ibov_itub4_mini_period500.txt")).done(function(data1, data2, data3){
            data1 = data1[0];
            data2 = data2[0];
            data3 = data3[0];
            data1 = data1.substr(0, data1.lastIndexOf(",")) + "]";
            data2 = data2.substr(0, data2.lastIndexOf(",")) + "]";
            data3 = data3.substr(0, data3.lastIndexOf(",")) + "]";
            $('#container').highcharts('StockChart', {
                rangeSelector : {
                    selected : 1
                },

                title : {
                    text : 'itub4'
                },
                series : [{
                    name : '30',
                    data : JSON.parse(data1), //array of arrays
                    tooltip: {
                        valueDecimals: 2
                    },
                    turboThreshold: 0
                },
                {
                    name : '200',
                    data : JSON.parse(data2), //array of arrays
                    tooltip: {
                        valueDecimals: 2
                    },
                    turboThreshold: 0
                },
                {
                    name : '500',
                    data : JSON.parse(data3), //array of arrays
                    tooltip: {
                        valueDecimals: 2
                    },
                    turboThreshold: 0
                }]
            });});
*/