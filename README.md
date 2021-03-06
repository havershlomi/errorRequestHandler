# Error request handler


error request handler is module based on Request module, this module allows you to use the power of Request with a simple 
to use error handling machenisim.

You can return custom errors based on api error code using your own custom error/function.
 
## How? 

```javascript
 npm install error-request-handler 
```

```javascript
 var errorHandlerRequest = require('error-request-handler'); 
 
 errorHandlerRequest('http://www.google.com', {
      method: "get"
      }, {
          1506: new Error("this is custom error"),
          1500: function (response, body, next) {
             //do stuff before throwing this error
             next(new Error("This is custom function error"));
          },'*': function (response, body, next) {
             //if it's not 1506 or 1500 then enter this code
             next(new Error("This is custom function error"));
          },
      },
      function (err, response, body) {
          if (err) return next(err);
          res.send({});
      });
 })
```

## more
The request function takes 4 arguments.
 
### uri
> the uri of the api resource.

### options
> specific request options ex. method type, body, headers...
*can take every option that [request](https://www.npmjs.com/package/request#requestoptions-callback) module accepts. 

### errorObject
> this object contains key value pair of error number/string and error handler (custom error/function).
> it's possible to specify '*' error handler for each unspecified error, this handler will catch every error if a specific error handler wasn't provided.

### callback 
> this function take (err, response, body) and allows you to handle the response. 

## The flow
> When a response return from the server it goes through generalErrorHandler (specified in options), your custom errorObject and then your custom callback.
> generalErrorHandler check if an general error occurred and return next with or without an error.
> After the general error handler the specific error handler will look for the error in the error object* and then run the corresponding error function or throw the custom error provided.
> your callback function fired at the end and get the error object* ,response and body. 

*if occurred

## Your custom request function
You can create custom base request that you can use across your entire application by doing this:
 
```javascript
var errorHandlerRequest = require('error-request-handler');
var customRequest = errorHandlerRequest.defaults({
    generalErrorHandler: function (response, body, next) {
        if (response.statusCode === 200) return next();
        if (response.statusCode === 404) return next(new Error("page not found"));
        if (response.statusCode === 401) return next(new Error("Access denied"));
        if (response.statusCode === 400 && body.errorCode === 0) return next(new Error("Unknown user error occur", 1));
    },errorCodeField: "the name of the error code field",
});
customRequest("http://localhost:1337/error", {
        method: "get"
}, {
    1506: new Error("this is custom error for api error 1506"),
    1500: function (response, body, next) {
        next(new Error("This is custom function error"));
    }
},
function (err, response, body) {
    if (err) return next(err);
    res.send({});
});
```

## Options

### default options object
 
```javascript
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
```

### requestOptions
> you can specify default request object.
!important by default the request options are set to allow json response in order to handle the errors.

### errorCodeField 
> this option specify the name of the error code property in the body object.
   ```javascript
   body = {
       errorCode:15633,
       moreData: "from server",
       ...
   };
   ```

### generalErrorHandler
> This function take 3 arguments (response, body, next).
> In this function you can check for a general errors like the ones in the response.statusCode, this function triggered before the custom error handler.
> by default this function returned next.
> !important this function should always return next at each endpoint of your code.

