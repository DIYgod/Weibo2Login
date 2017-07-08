var express = require('express');
var session = require('express-session');

var util = require('util');

var passport = require('./passport');
var config = require('./config');

var app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',
    passport.authenticate('weibo'),
    function (req, res) {
    }
);

app.get('/callback',
    passport.authenticate('weibo', { failureRedirect: '/' }),
    function (req, res) {
        res.send("<script>window.opener=null;window.open('','_self');window.close();</script>");
    }
);

app.get('/logout', function (req, res) {
    req.logout();
    res.send("<script>window.opener=null;window.open('','_self');window.close();</script>");
});

app.get('/account', function (req, res) {
    for (var i = 0; i < config.allowOrigin.length; i++) {
        if (new RegExp(config.allowOrigin[i]).test(req.headers.origin)) {
            res.header("Access-Control-Allow-Origin", req.headers.origin);
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
            res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
            res.header('content-type', 'application/json; charset=utf-8');
            res.send(JSON.stringify(req.user));
            return;
        }
    }
    res.send('');
});

console.log(`🍻 Weibo2Login start! Cheers!`);

app.listen(1212);