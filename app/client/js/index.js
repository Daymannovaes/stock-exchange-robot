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

    var $filter_sma = $("#filter_sma");
    var $filter_ema = $("#filter_ema");

    $("#build").click(function() {
        var periods_sma = $filter_sma.find("input[type='checkbox']:checked");
        var periods_ema = $filter_ema.find("input[type='checkbox']:checked");

        var urlBase_sma = "sma?stock=" + stock + "&period=";
        var urlBase_ema = "ema?stock=" + stock + "&period=";

        for(var i=0; i<periods_sma.length; i++) {
            $.get(urlBase_sma + periods_sma[i].name.substr(6), function() {
                console.log(periods_sma[i].name + " done");
            });
        }
        for(var i=0; i<periods_ema.length; i++) {
            $.get(urlBase_ema + periods_ema[i].name.substr(6), function() {
                console.log(periods_ema[i].name + " done");
            });
        }
    });
    
    $("#search").click(function() {
        var periods_sma = $filter_sma.find("input[type='checkbox']:checked");
        var periods_ema = $filter_ema.find("input[type='checkbox']:checked");

        var urlBase_sma = "public/candles/sma/candles_ibov_" + stock + "_mini_";
        var urlBase_ema = "public/candles/ema/candles_ibov_" + stock + "_mini_";

        var urls = [];

        for(var i=0; i<periods_sma.length; i++)
            urls.push($.get(urlBase_sma + periods_sma[i].name + ".txt"));
        for(var i=0; i<periods_ema.length; i++)
            urls.push($.get(urlBase_ema + periods_ema[i].name + ".txt"));
        if($("#showStock").is(":checked")) {
            urls.push($.get("public/candles/candles_ibov_itub4_mini_period1.txt"));
        }

        $.when.apply(this, urls).done(function() {
            var args = Array.prototype.slice.call(arguments),
                series = [];

            args = normalizeResponses(args);
            for(var i=0; i<args.length; i++) {
                series.push({
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