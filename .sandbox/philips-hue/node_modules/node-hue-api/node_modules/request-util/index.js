"use strict";

var util = require("util")
    , Q = require("q")
    , request = require("request")
    ;

/**
 * Builds a Url from the path components
 * @param parts The parts of the URL, either an array, or a number of arguments
 * @returns {string} The URL composed of the path parts
 * @private
 */
function _buildUrl(parts) {
    var pathParts = [];

    function addArg(arg) {
        var value = arg;

        if (value) {
            if (value.charAt(0) === "/") {
                value = value.substr(1);
            }

            if (value.charAt(value.length - 1) === "/") {
                value = value.substr(0, value.length - 1);
            }

            pathParts.push(value);
        }
    }

    for (var i = 0; i < arguments.length; i++) {
        if (util.isArray(arguments[i])) {
            arguments[i].forEach(addArg);
        } else {
            addArg(arguments[i]);
        }
    }

    return pathParts.join("/");
}

/**
 * Creates a promise that will perform a request using the provided options.
 * @param requestOptions The options detailing the request.
 * @returns {Q.promise} That will resolve to the an object with statusCode and body content data if successful, or will
 * reject upon error.
 *
 * @private
 */
function _request(requestOptions) {
    var deferred = Q.defer();

    if (requestOptions.debug) {
        console.log(JSON.stringify(_generateDisplayParameters(requestOptions), null, 2));
    }

    request(requestOptions, function (error, response, body) {
        var result = {};

        if (error) {
            deferred.reject(error);
        } else {
            result.statusCode = response.statusCode;

            if (!requestOptions.json 
                && response.headers
                && response.headers["content-type"]
                && response.headers["content-type"].indexOf("application/json") >= 0) {
                result.data = JSON.parse(body);
            } else {
                result.data = body;
            }
            deferred.resolve(result);
        }
    });

    return deferred.promise;
}


function _get(options) {
    options.method = "GET";
    return _request(options);
}

function _delete(options) {
    options.method = "DELETE";
    return _request(options);
}

function _put(options, content) {
    return _putOrPost("PUT", options, content);
}

function _post(options, content) {
    return _putOrPost("POST", options, content);
}

function _putOrPost(action, options, content) {
    options.method = action;

    if (content) {
        if (content.body) {
            options.body = content.body;
        }
        if (content.type) {
            options.headers["Content-Type"] = content.type
        }
    }

    return _request(options);
}

function _generateAuth(username, password) {
    var result = null;

    if (username && password) {
        result = {
            username: username,
            password: password
        };
    }
    return result;
}

function _requireStatusCode(expectedStatusCode, failureMessage) {
    return function (result) {
        var message
            , error
            ;

        if (result.statusCode === expectedStatusCode) {
            return result.data;
        } else {
            message = "Unexpected statusCode from server, required %s but got %s; ";
            if (result.data) {
                message += JSON.stringify(result.data);
            }
            if (failureMessage) {
                message = failureMessage + "\n" + message;
            }

            error = new Error(util.format(message, expectedStatusCode, result.statusCode));
            error.statusCode = result.statusCode;
            error.data = result.data;

            throw error;
        }
    }
}

function _generateDisplayParameters(params) {
    var displayParams = {};

    Object.keys(params).forEach(function(key) {
        var value = params[key];

        if (/password/.test(key)) {
            value = "***** REDACTED *****";
        }

        displayParams[key] = value;
    });

    return displayParams;
}

module.exports = {
    buildUrl: _buildUrl,
    get: _get,
    delete: _delete,
    post: _post,
    put: _put,
    request: _request,
    requireStatusCode: _requireStatusCode,
    generateAuth: _generateAuth
};
