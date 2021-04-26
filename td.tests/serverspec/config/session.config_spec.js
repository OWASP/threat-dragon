'use strict';

//this is a lot of mocking for small amount of test - am i doing something wrong?
describe('session config tests', function() {

    var express = require('express');
    var util = require('util');
    var passport = require('passport');
    var Strategy = require('passport-local').Strategy;
    var app = express();
    var request = require('supertest');
    var finish_test = require('../supertest-jasmine');
    var mockery = require('mockery');
    var store;
    var body = { username: 'mike', password: 'pwd' };

    //environment
    var signingKey = 'signingKey';
    var logger = require('../../../td.server/config/loggers.config').logger;
    process.env.SESSION_SIGNING_KEY = signingKey;

    beforeEach(function() {

        mockery.enable({ useCleanCache: true });
        mockery.warnOnUnregistered(false);
        mockery.warnOnReplace(false);
        
        //connect-azuretables mocks
        mockery.registerMock('connect-azuretables', function(session) {

            var MockStore = function() { };
            util.inherits(MockStore, session.Store);

            MockStore.prototype.set = function(sid, data, fn) {
                return fn(null, true);
            };

            MockStore.prototype.get = function(sid, fn) {
                return fn(null, sid);
            };

            var mockFactory = {
                create: function() {
                    store = new MockStore();
                    return store;
                }
            };

            return mockFactory;
        });

        passport.use(new Strategy(
            function(username, password, cb) {
                return cb(null, { name: username });
            }));

        passport.serializeUser(function(user, cb) {
            cb(null, user);
        });

        passport.deserializeUser(function(obj, cb) {
            cb(null, obj);
        });

        spyOn(logger, 'error');
        require('../../../td.server/config/session.config')(app);
        app.use(passport.initialize());
        app.use(passport.session());
        require('../../../td.server/config/parsers.config')(app);
        
        jasmine.clock().install();
    });

    afterEach(function() {
        mockery.disable();
        jasmine.clock().uninstall();
    });

    afterAll(function() {
        mockery.deregisterAll();
    });

    it('should set a session cookie', function(done) {
        
        var baseTime = new Date(1000);
        var maxAge = 'Thu, 01 Jan 1970 01:00:01 GMT';
        jasmine.clock().mockDate(baseTime);

        app.post('/',
            passport.authenticate('local', { failureRedirect: '/error' }),
            function(req, res) {
                res.status(200);
                res.send('result');
            });

        request(app)
            .post('/')
            .type('form')
            .send(body)
            .expect(200)
            .expect(function(res) {
                expect(res.headers['set-cookie'][0].indexOf('connect.sid') >= 0).toBe(true);
                expect(res.headers['set-cookie'][0].indexOf('HttpOnly') >= 0).toBe(true);
                expect(res.headers['set-cookie'][0].indexOf('Path=/') >= 0).toBe(true);
                expect(res.headers['set-cookie'][0].indexOf(maxAge) >= 0).toBe(true);
            })
            .end(finish_test(done));
    });

    it('should set the user on the session', function(done) {

        app.post('/',
            passport.authenticate('local', { failureRedirect: '/error' }),
            function(req, res) {
                expect(req.session.user).toEqual(body.username);
                res.status(200);
                res.send('result');
            });

        request(app)
            .post('/')
            .type('form')
            .send(body)
            .expect(200)
            .end(finish_test(done));
    });
});

