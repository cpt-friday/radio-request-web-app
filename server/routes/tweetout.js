var express = require('express');
var router = express.Router();

var tokens = require('../config.js');
const {TwitterApi} = require('twitter-api-v2');
const client = new TwitterApi({
    appKey: tokens.consumer_key,
    appSecret: tokens.consumer_secret,
    accessToken: tokens.access_token_key,
    accessSecret: tokens.access_token_secret
});


router.post('/', (req, res) => {
    var displaytext = req.body.text;
    client.v2.tweet(displaytext);
    res.send(displaytext);
});

module.exports = router;