'use strict';

var request = require("request"),
    extend = require("extend");


function errorBaseRequest(uri, options, errorObj, callback) {
    this.defaults = {
        requestOptions: {},
        errorCodeField: "errorCode"
    };
    this.baseRequest = request.defaults({});

    return this.baseRequest(uri, options,
        function (err, response, body) {
            if (err) return callback(err);


            var error = errorObj[body[this.options.errorCodeField]] || errorObj["*"];

            if (error !== undefined) {
                if (error instanceof Error) return callback(error);
                if (error instanceof Function) return error(response, body, function (err) {
                    callback(err, response, body);
                });
            }

            return callback(new Error("Unknown Error", body[this.options.errorCodeField]));
        });
};

errorBaseRequest.defaults = function (options) {
    extend(true, this.defaults, options);
    if (options.errorCodeField === undefined || options.errorCodeField.length === 0) throw new Error("errorCodeField can't be empty or undefined");
    this.baseRequest = request.defaults(this.defaults.requestOptions || {});
};

module.exports = errorBaseRequest;