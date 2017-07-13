$(function () {
            
            // $('.transaction-container').first().addClass('active');

            
            function build_chart(data1, data2) {
                var myChart = Highcharts.chart('container', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Value Change After Transaction'
                    },
                    xAxis: {
                        categories: ['Fluctuation']
                    },
                    yAxis: {
                        title: {
                            text: 'Amount USD'
                        }
                    },
                    series: [{
                        name: 'Purchase Time',
                        data: [data1]
                    }, {
                        name: 'Now',
                        data: [data2]
                    }]
                });
            }
            $('.transaction-container').click(function(){
                //is my chart in scope
                console.log('clicked-on: ', $(this).attr('id'));
                $('.active').removeClass('active');
                var currData = transactionData[parseInt($(this).attr('id').substring(4))]
                console.log('currdata: ', currData)
                $(this).addClass('active');
                crypt_value = parseFloat(currData['amount']['amount'])
                currency1 = currData['amount']['currency']
                data1 = parseFloat(currData['total']['amount'])
                currency2 = currData['total']['currency'];
                $.ajax('https://api.coinbase.com/v2/prices/'+currency1+'-'+currency2+'/buy',
                    {
                        success: function(data) {
                            console.log('success')
                            data2 = parseInt(data['data']['amount'])*crypt_value
                            console.log('crypt value:', crypt_value);
                            console.log('data1: ', data1)
                            console.log('data2: ', data2)
                            build_chart(data1, data2)
                        },
                        error: function(data) {
                            console.log('error')
                        }
                    })     
            });

        });