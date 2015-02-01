'use strict';

var request = require("request"),
    extend = require("extend"),
    baseRequest = require("./lib/baseRequest");
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
function errorBaseRequest(uri, options, errorObj, callback) {
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
        },
        baseRequest = request.defaults(defaults.requestOptions);
    var self = this;

    return new baseRequest.BaseRequest(defaults);
};

errorBaseRequest.defaults = function (options) {
    extend(true, this.defaults, options);
    if (options.errorCodeField !== undefined && (typeof options.errorCodeField !== "string" || options.errorCodeField.length === 0)) throw new Error("errorCodeField must be non empty string");
    if (options.generalErrorHandler === undefined && !(options.generalErrorHandler instanceof Function)) throw new Error("generalErrorHandler must be a function");
    this.baseRequest = request.defaults(this.defaults.requestOptions || {});
};



module.exports = errorBaseRequest;