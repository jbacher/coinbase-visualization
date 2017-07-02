var express = require('express')
var app = express()
var request = require('request')
var Client = require('coinbase').Client;
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//the below is used to access an account
// var client = new Client({'accessToken': accessToken, 'refreshToken': refreshToken});


var apiKey = 'z93mNhfDQLAd9oOD'
var apiSecret = 'qbbZcFdO3XQqoEIqpC8DzqqLrvSOuzXb'


//to get a list of transactions
// https://api.coinbase.com/v2/accounts/:account_id/transactions
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')



//taking care of business
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//TODO add in hashing state value to ensure proper oauth
app.get('/', function (req, res) {
    //if not logged in then redirect to login
    console.log('hi1')

    //This is the one that gives the invalid token error because i do not have an api version set up yet

    // request('https://api.coinbase.com/v2/user', 
    //     {headers :
    //         {
    //             'CB-VERSION' : "2017-06-08"
    //     }},
    //     function(error, response, body) {
    //          console.log('error:', error); // Print the error if one occurred 
    //          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
    //          console.log('body:', body); // Print the HTML
    //         //  res.send(body)
    //         // res.render('index', {title: 'Express'})
    // })

    //checking bitcoin price
    console.log('hi2')
    request('https://api.coinbase.com/v2/prices/BTC-USD/spot',
      {headers :
            {
                'CB-VERSION' : "2017-06-08"
        }},
        function(error, response, body) {
         console.log('error:', error); // Print the error if one occurred 
        //  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
        // console.log(response)
         console.log('body:', body); // Print the HTML
        //  res.send(body)
        console.log('hi4')
        body = JSON.parse(body)

        console.log('getting data from coinbase')
        var client = new Client({
            'apiKey': apiKey,
            'apiSecret': apiSecret,
            'version': '2017-06-08'
        })
        client.getAccounts({}, function(err, accounts) {
            if (err) {
                console.log(err)
                res.render('error', err)
            } else {
            transacations = [];
            accounts2 = [];
            //going to make this async

           getTransactionsHelper(accounts, body, res, req)


           //amt = 1 bit coin native = 10 usd
           //in terms of transactions "amount" is how much you got it for
           //native amount is the amount usd you paid
           //will organize them by date

            // console.log(accounts)
            // console.log(transacations)
            }
        });

    })
})

function getTransactionsHelper(accounts, body, res, req){
    accounts.forEach(function(acct) {
                accounts2.push(acct)
                console.log(acct.name + ': ' + acct.balance.amount + ' ' + acct.balance.currency);
                acct.getTransactions(null, function(err, txns) {
                    if (err) {
                        console.log(err)
                        return 'an error occured';
                    }
                transactions = []
                for (txn in txns) {
                    transacations.push(txn)
                }
                    console.log('final')
                    console.log(transactions.length)
                    console.log("finished")
                    res.render('index', {title: 'Express', transactions: transactions, price: body['data']['amount']})

                });
            });
}


//will worry about auth later, right now want a working product
app.get('/display_test', function(req, res) {
    res.render('index', {title: 'MyData'})
})

app.get('/login', function (req, res) {
    res.redirect('https://www.coinbase.com/oauth/authorize?response_type=code&client_id=266828eb7143c9953eb9b7ddaef6e36e7e683b66e362e0a841c306d5fc12d04c&state=134ef5504a94&scope=wallet%3Auser%3Aread')
})





app.get('/oauth/callback', function(req, res) {
    console.log('hi3')
    oauth_code = req.query.code
    console.log('code='+oauth_code)
    request.post(
        'https://api.coinbase.com/oauth/token',
        {form : 
            {
                grant_type: 'authorization_code',
                code: oauth_code,
                client_id: '266828eb7143c9953eb9b7ddaef6e36e7e683b66e362e0a841c306d5fc12d04c',
                client_secret: 'bff8216cd9482559a258e94678cc54d072c8c8512d731a52fb520404c17e0304',
                redirect_uri: 'http://afternoon-ridge-15676.herokuapp.com/'
            }
        },
        function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred 
             console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
             console.log('body:', body); // Print the HTML
            console.log('probably going to redirect')
            //  res.send(body)
        }
    )
})

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
  console.log('Example app listening on port '+ app.get('port'))
})