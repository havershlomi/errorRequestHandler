'use strict';

var extend = require("extend"),
    BaseRequest = require("./lib/baseRequest");

//request options need to Accept json
var defaults = {
    requestOptions: {
        headers: {
            "Accept": "JSON",
            "Content-Type": "application/json"
        }, json: true
    },
    errorCodeField: "errorCode",
    generalErrorHandler: function (response, body, next) {
        next();
    }
};
//Create base request object and run send the request
function errorBaseRequest(uri, options, errorObj, callback) {
    console.log("here");
    return new BaseRequest(defaults)(uri, options, errorObj, callback);
};

//update defaults and return the baseRequest
module.exports = errorBaseRequest;

errorBaseRequest.defaults = function (options) {
    extend(true, defaults, options);
    if (options.errorCodeField !== undefined && (typeof options.errorCodeField !== "string" || options.errorCodeField.length === 0)) throw new Error("errorCodeField must be non empty string");
    if (options.generalErrorHandler === undefined && !(options.generalErrorHandler instanceof Function)) throw new Error("generalErrorHandler must be a function");
    return new BaseRequest(defaults);
};
