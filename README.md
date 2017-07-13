
very important to make changes in the passport-coinbase module as it is out of date

eventually, changes will be made so the user would not manually have to do this

in node_modules/passport-coinbase/lib/passport-coinbase/strategy.js
```javascript
Strategy.prototype.userProfile = function(accessToken, done) {
  console.log('this is a test'+accessToken)
  request('https://api.coinbase.com/v2/user/',
        {
            headers:
            {
                'CB-VERSION' : "2017-06-08",
                Authorization: 'Bearer '+accessToken
            }
        },
        function(err, httpResponse, body) {
          if (err) return new Error;
           var json = JSON.parse(body)
           console.log(json)
           profile = {}
           profile.id = json.data.id
           done(null, profile)
        })
};
```

npm install
npm start