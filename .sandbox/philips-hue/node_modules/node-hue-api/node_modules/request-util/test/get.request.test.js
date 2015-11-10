"use strict";

var expect = require("chai").expect,
    httpUtil = require("..");

describe("#get()", function () {

    it("should get google.com webpage", function (done) {
        var options = {
            url: "http://www.google.com"
        };

        httpUtil.get(options)
            .then(function (result) {
                      expect(result).to.have.property("statusCode").to.equal(200);
                      done();
                  })
            .done();

    });
});