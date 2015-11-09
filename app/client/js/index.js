$(document).ready(function(undefined) {
	"use strict";

    var stock = "itub4";
    var normalizeResponses = function(responses) {
        if(typeof responses[2] == "object" && !(responses[2] instanceof Array))
            return [normalizeResponse([responses[0]])];

        for(var i=0; i<responses.length; i++) {
            responses[i] = normalizeResponse(responses[i]);
        }
        return responses;
    };
    var normalizeResponse = function(response) {
        response = response[0];
        return response.substr(0, response.lastIndexOf(",")) + "]";
    };

    var $filter = $("#filter");

    $filter.find("#build").click(function() {
        var periods = $filter.find("input[type='checkbox']:checked");

        var urlBase = "sma?stock=" + stock + "&period=";

        var urls = [];
        for(var i=0; i<periods.length; i++) {
            $.get(urlBase + periods[i].name.substr(6), function() {
                console.log(periods[i].name + " done");
            });
        }
    });
    
    $filter.find("#search").click(function() {
        var periods = $filter.find("input[type='checkbox']:checked");

        var urlBase = "public/candles/candles_ibov_" + stock + "_mini_";

        var urls = [];

        for(var i=0; i<periods.length; i++)
            urls.push($.get(urlBase + periods[i].name + ".txt"));

        $.when.apply(this, urls).done(function() {
            var args = Array.prototype.slice.call(arguments),
                series = [];

            args = normalizeResponses(args);
            for(var i=0; i<args.length; i++) {
                series.push({
                    name : periods[i].name,
                    data : JSON.parse(args[i]), //array of arrays
                    tooltip: {
                        valueDecimals: 2
                    },
                    turboThreshold: 0
                });
            }

            $('#container').highcharts('StockChart', {
                rangeSelector : {
                    selected : 1
                },

                title : {
                    text : stock
                },
                series : series
            });
        });
    });
});