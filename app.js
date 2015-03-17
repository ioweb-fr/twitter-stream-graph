var Twitter = require('twitter');
var express = require('express');
var cors = require('express-cors');

var client = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

var keywords = 'lolcat,kitten,#cute,pony,twitter';
var kwArr = keywords.split(',');
var layerCount = kwArr.length;
var counters = {};
var streamData = [];
var lastN = [];
var lastNCount = 9;
var size = 100;
var step = 2000;
var y0 = 0;

initStream();
initApp();

/**
 * Process data on each tick
 */
function onTick() {
    var tickValues = [];
    for (var l = 0; l < layerCount; l++) {
        tickValues.push(counters[kwArr[l]]);
    }
    streamData.forEach(function(layer, i) {
        layer.values.shift();
        layer.values.forEach(function (d) {
            d.x--;
        });
        if (lastN[i].length > lastNCount) lastN[i].shift();
        lastN[i].push(tickValues[i]);
        var newY = sum(lastN[i]);
        layer.values.push({"x": size,
                    "y": newY,
                    "y0": y0}
        );
    });
    clearCounters();
}

/**
 * Process incoming twitter data
 */
function onTweet(tweet) {
    kwArr.forEach(function(kw) {
        var matched = false;

        var splitted = kw.split(' ');
        splitted.forEach(function(w) {
            if (tweet.text.match(new RegExp(w, "i"))) {
                matched = true;
            }
        });
        if (matched) counters[kw]++;
    });
}

/**
 * Utilities
 */
function initApp() {
    var app = express();
    app.use(cors({
        allowedOrigins: [
            'localhost:*'
        ]
    }));
    app.get('/streamdata', function (req, res) {
        res.send(streamData)
    });

    var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log("Listening on " + host + ":" + port);
    });
}

function initStream() {
    kwArr.forEach(function(kw, i) {
        lastN.push([]);
        streamData.push({
            "name": kw,
            "values": []
        });
        for (var k = 0; k<size; k++) {
            streamData[i].values.push({"x":k,"y":0,"y0":y0});
        }
    });
    clearCounters();

    client.stream('statuses/filter', {track: keywords}, function (stream) {
        stream.on('data', onTweet);
        stream.on('error', function (error) {
            console.log(error);
        });
    });

    setInterval(onTick, step);
}

// Sum elements of an array
function sum(arr) {
    var total = 0;
    for (var i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    return total;
}

function clearCounters() {
    kwArr.forEach(function(kw) {
        counters[kw] = 0;
    });
}