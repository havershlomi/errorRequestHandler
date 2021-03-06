'use strict';

var request = require("request"),
    async = require("async");

function BaseRequest(defaults) {
    this.defaults = defaults;
    this.baseRequest = request.defaults(this.defaults.requestOptions);
    return this.request();
}

BaseRequest.prototype.request = function () {
    var self = this;
    return function (uri, options, errorObj, callback) {
        self.baseRequest(uri, options,
            function (err, response, body) {
                if (err) return callback(err);
                async.series([function (next) {
                    self.defaults.generalErrorHandler(response, body, next);
                }, function (next) {
                    var error = errorObj[body[self.defaults.errorCodeField]] || errorObj["*"];

                    if (error !== undefined) {
                        if (error instanceof Error) return next(error);
                        if (error instanceof Function) return error(response, body, function (err) {
                            next(err, response, body);
                        });
                    } else {
                        return next();
                    }

                }], function (err) {
                    if (err) return callback(err);
                    callback(null, response, body);
                });
            });
    };
};

module.exports = BaseRequest;