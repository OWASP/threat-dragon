'use strict';

var request = require('supertest');
var express = require('express');
var finish_test = require('./helpers/supertest-jasmine');

describe('security header tests', function () {

    var app;

    beforeEach(function () {

        app = express();
        require('../../td/config/securityheaders.config')(app, true);
        app.get('/', function (req, res) {
            res.status(200).send('result');
        });

    });

    it('should remove the x-powered-by header', function (done) {

        function noXPoweredBy(res) {

            if (res.header["x-powered-by"]) {
                throw new Error('Found X-Powered-By header: ' + res.header["x-powered-by"]);
            };
        };

        request(app)
            .get('/')
            .expect(200)
            .expect(noXPoweredBy)
            .end(finish_test(done));
    });

    it('should set x-frame-options DENY', function (done) {

        request(app)
            .get('/')
            .expect(200)
            .expect('x-frame-options', 'DENY')
            .end(finish_test(done));

    });

    it('should set x-content-type-options nosniff', function (done) {

        request(app)
            .get('/')
            .expect(200)
            .expect('x-content-type-options', 'nosniff')
            .end(finish_test(done));

    });

    it('should set x-xss-protection', function (done) {

        request(app)
            .get('/')
            .expect(200)
            .expect('x-xss-protection', '1; mode=block')
            .end(finish_test(done));

    });

    it('should set HSTS polcy', function (done) {

        request(app)
            .get('/')
            .set('protocol', 'https')
            .expect(200)
            .expect('strict-transport-security', 'max-age=7776000')
            .end(finish_test(done));

    });

    it('should set CSP', function (done) {

        var csp = 'default-src \'none\'; script-src \'self\'; conn' +
            'ect-src \'self\'; style-src \'self\' https://fonts.googleapis.com \'' +
            'unsafe-inline\'; img-src \'self\' data:; font-src \'self\' https://fonts.gstatic.com ' +
            'data:; form-action \'self\' https://github.com; report-uri https://owaspthreatdragon.report-uri.com/r/d/csp/enforce';

        request(app)
            .get('/')
            .expect(200)
            .expect('content-security-policy', csp)
            .expect('x-content-security-policy', csp)
            .expect('x-webkit-csp', csp)
            .end(finish_test(done));

    });

    it('should set a referrer policy', function (done) {

        var referrer = 'strict-origin-when-cross-origin';

        request(app)
            .get('/')
            .expect(200)
            .expect('referrer-policy', referrer)
            .end(finish_test(done));

    });
});
