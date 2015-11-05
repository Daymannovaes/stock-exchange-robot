(function(undefined) {
	"use strict";
	
	$.get("public/candles_ibov_itub4_mini.csv", function(data) {
		//$("#csv").html(data);
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
            text: 'ITUB4'
        },
        subtitle: {
            text: ''
        }
    });
	});
})();