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
            $('#container').highcharts({
                data: {
                    csv: data,
                    dateFormat: "YYYY-mm-dd"
                },
                yAxis: {
                    title: {
                        text: 'Date'
                    }
                },
                plotOptions: {
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                title: {
                    text: stock.toUpperCase()
                },
                subtitle: {
                    text: ''
                }
            });
        });
    });
})