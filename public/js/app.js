$(function () {
            var regex = /amt = \d*.?\d* (\S+)/
            var result_arr = regex.exec($('.amt-0').text())

            var myChart = Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Value Change After Transaction'
                },
                xAxis: {
                    categories: ['Original Value', 'Current Value']
                },
                yAxis: {
                    title: {
                        text: 'Amount USD'
                    }
                },
                series: [{
                    name: 'Jane',
                    data: [1, 0]
                }, {
                    name: 'John',
                    data: [5, 7]
                }]
            });
        });