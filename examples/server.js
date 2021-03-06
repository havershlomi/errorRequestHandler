// # express-cdn

var express = require('express')
    , errorHandlerRequest = require('./../index');

var app = express();
app.set('view engine', 'express');

console.log("Server started: http://localhost:1337");
app.listen(1337);
app.get("/test", function (req, res, next) {
    errorHandlerRequest("http://localhost:1337/error", {
            method: "get"
        }, {
            1506: new Error("this is custom error"),
            1500: function (response, body, next) {
                next(new Error("This is custom function error"));
            }
        },
        function (err, response, body) {
            if (err) return next(err);
            res.send({});
        });
});

app.get("/error", function (req, res, next) {
    return res.send({errorCode: 1500, error: "custom error"});
});

//var customRequest = errorHandlerRequest.defaults({
//    generalErrorHandler: function (response, body, next) {
//        if (response.statusCode === 200) return next();
//        if (response.statusCode === 404) return next(new Error("page not found"));
//        if (response.statusCode === 401) return next(new Error("Access denied"));
//        if (response.statusCode === 400 && body.errorCode === 0) return next(new Error("Unknown user error occur", 1));
//    }
//});



