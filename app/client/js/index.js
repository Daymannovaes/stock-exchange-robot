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
                text: 'Share prices'
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
            text: 'Royal Mail shares over time'
        },
        subtitle: {
            text: 'Auto-detection of <em>mm/dd/YYYY</em> dates in Highcharts Data module'
        }
    });
	});
})();