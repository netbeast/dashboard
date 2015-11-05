"use strict";

var expect = require("chai").expect,
    httpUtils = require("..");

describe("#buildUrl()", function () {

    it("should create a path from a single value", function () {
        var value = httpUtils.buildUrl("http://www.google.com");
        expect(value).to.equal("http://www.google.com");
    });

    it("should create a path from a two values", function () {
        var value = httpUtils.buildUrl("http://www.google.com", "projects");
        expect(value).to.equal("http://www.google.com/projects");
    });

    it("should create a path from a two values where one contains multiple paths", function () {
        var value = httpUtils.buildUrl("http://www.google.com", "projects/a/b");
        expect(value).to.equal("http://www.google.com/projects/a/b");
    });

    it("should create a path from a multiple values", function () {
        var value = httpUtils.buildUrl("http://www.google.com", "projects", "query", "for", "type");
        expect(value).to.equal("http://www.google.com/projects/query/for/type");
    });

    it("should create a path from a multiple values with leading and trailing slashes", function () {
        var value = httpUtils.buildUrl("http://www.google.com", "projects/", "/t/", "/repo", "type/");
        expect(value).to.equal("http://www.google.com/projects/t/repo/type");
    });
});