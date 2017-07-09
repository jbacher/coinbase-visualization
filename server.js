var express = require('express')
var app = express()
var request = require('request')
var Client = require('coinbase').Client;
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport')
var CoinbaseStrategy = require('passport-coinbase').Strategy

//the below is used to access an account
// var client = new Client({'accessToken': accessToken, 'refreshToken': refreshToken});

//todo possibly add a destroy time for the sessions because the tokens do expire
app.use(session({secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true}))
//NOT MEANT FOR PRODUCTION ONLY PROOF OF CONCEPT



//TODO move to dotenv
var apiKey = 'z93mNhfDQLAd9oOD'
var apiSecret = 'qbbZcFdO3XQqoEIqpC8DzqqLrvSOuzXb'
var client_id = 'a3d8a74a99cc4decff2ff0d5cc9aba7fd2630089ba2c544e79d574a28d1da6ec'
var client_secret = 'b9cd2389af59e7cd5872443d1b0867e16d3e07d8acc3035cddcc5f8738dd7c19'
var token_keys = {}

passport.use(new CoinbaseStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: 'http://localhost:3000/oauth/callback',
    scope: ["wallet:transactions:read", "wallet:accounts:read"],
    userProfileURL: 'https://api.coinbase.com/v2/users'
},
    function(access_token, refresh_token, profile, done) {
        console.log('we made it')
        profile.access_token = access_token;
        profile.refresh_token = refresh_token
        console.log(profile)

        //consider reducing profile to just the access and refresh tokens
        process.nextTick(function(){
            console.log('hello')
            return done(null, profile)
        })
    }))

passport.serializeUser(function(user, done) {
    console.log('a')
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log('b')
  done(null, user);
});

//to get a list of transactions
// https://api.coinbase.com/v2/accounts/:account_id/transactions
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

//right now only supports one user i believe

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
})

//taking care of business
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//TODO add in hashing state value to ensure proper oauth
app.get('/',  ensureAuthenticated, function (req, res) {
    //if not logged in then redirect to login
    //need to grab transacation data
    console.log('omg')
    console.log(req.user)
    request('https://api.coinbase.com/v2/accounts',
    {
        headers:
            {
                'CB-VERSION' : "2017-06-08",
                Authorization: 'Bearer '+req.user.access_token
            }
        },
        function(error, response, body) {
            if (error) {
                console.log("error:", error)
            }
            console.log('body:', body)
            body = JSON.parse(body)

            //TODO if this app is for jairo and uses diff wallets, need to add that functionality
            // account_id = body.data[0].id
            console.log(body.data)
            console.log('account_id:', account_id)
            request('https://api.coinbase.com/v2/accounts/'+account_id+'/buys',
            {
                headers:{
                    'CB-VERSION' : "2017-06-08",
                    Authorization: 'Bearer '+req.user.access_token
                }
            },
            function(error, response, body) {
                if (error) {
                    console.log('error')
                }
                body = JSON.parse(body)
                console.log(body.data)
                res.render('index', {title : 'transactions', transactions: body.data})
            })
            // res.render('index', {title: 'transacations', transactions: transactions})
        })

    // var currency1 = req.user._json.bitcoin_units
    // var currency2 = req.user._json.native_currency

    // console.log('hi2')
    // console.log('currency 1:', currency1)
    // console.log('currency 1:', currency2)
    // coinbase_data = {}
    // request('https://api.coinbase.com/v2/prices/'+currency1+'-'+currency2+'/spot',
    //   {headers :
    //         {
    //             'CB-VERSION' : "2017-06-08"
    //     }},
    //     function(error, response, body) {
    //      console.log('error:', error); // Print the error if one occurred 
    //     //  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
    //     // console.log(response)
    //      console.log('body:', body); // Print the HTML
    //     //  res.send(body)
    //     console.log('hi4')
    //     body = JSON.parse(body)
    //     coinbase_data = body;
    //     console.log('getting data from coinbase')
    // })
})



//will eventually replace /
app.get('/display_test', function(req, res) {
    // res.render('index', {title: 'MyData'})
    console.log('test')
    console.log(req.user)
    console.log(req.user.access_token)
    res.send('hello_mate')
})

// app.get('/login', function (req, res) {
    // res.redirect('https://www.coinbase.com/oauth/authorize?response_type=code&client_id='+client_id+'&state=134ef5504a94&scope=wallet%3Auser%3Aread')
app.get('/login',
    passport.authenticate('coinbase', { failureRedirect:'/display_test'}),
    function(req,res) {
        // res.redirect('display_test')
        //won't be called
    })
// })



app.get('/oauth/callback', 
    passport.authenticate('coinbase', {failureRedirect: "/display_test"}),
    function (req, res) {
        console.log('to the start')
        res.redirect("/")
    })

// app.get('/oauth/callback', function(req, res) {
//     console.log('hi3')
//     oauth_code = req.query.code
//     console.log('code='+oauth_code)
//     request.post(
//         'https://api.coinbase.com/oauth/token',
//         {form : 
//             {
//                 grant_type: 'authorization_code',
//                 code: oauth_code,
//                 client_id: client_id,
//                 client_secret: 'b9cd2389af59e7cd5872443d1b0867e16d3e07d8acc3035cddcc5f8738dd7c19',
//                 redirect_uri: 'http://localhost:3000/oauth/callback' //do i have to encode this?
//             }
//         },
//         function (error, response, body) {
//             console.log('error:', error); // Print the error if one occurred 
//              console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
//              console.log('body:', body); // Print the HTML
//             console.log('probably going to redirect')
//             //  res.send(body)
//             body = JSON.parse(body)
//             console.log('access_token', body['access_token'])
//             console.log('refresh_token', body['refresh_token'])
//             //add these tokens in the header request

//             //valid session
//             req.session.valid = true;
//             req.session.access_token = body['access_token']
//             req.session.refresh_token = body['refresh_token']
    

//             res.redirect('/display_test')
//         }
//     )
// })
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
  console.log('Example app listening on port '+ app.get('port'))
})