'use strict';

var request = require('supertest');
var url = require('url');
var finish_test = require('./helpers/supertest-jasmine');
var jasmine = require('jasmine');
var mockery = require('mockery');

describe('passport configuration tests', function() {
    
    var clientID = 'id';
    var clientSecret = 'secret';
    process.env.GITHUB_CLIENT_ID = clientID;
    process.env.GITHUB_CLIENT_SECRET = clientSecret;
    
    var passport;
    var express;
    var app;
    var mock;
    var mockEncryptionHelper;
    
    beforeEach(function() {
        
        mockery.enable({ useCleanCache: true });
        mockery.warnOnUnregistered(false);
        mockery.warnOnReplace(false);
        
        //encryption helper mocks
        mockEncryptionHelper = {
            encrypt: function() {},
            decrypt: function() {}
        };
        
        mockery.registerMock('../helpers/encryption.helper', mockEncryptionHelper);
        
        passport = require('passport');
        spyOn(passport, 'initialize').and.callThrough();
        spyOn(passport, 'session').and.callThrough();
        express = require('express');
        app = express();
        require('../../td/config/passport.config')(app);
        app.get('/', passport.authenticate('github'));
        mock = {done: function() {}};
        spyOn(mock, 'done');
        
    });
    
    afterEach(function() {
        mockery.disable();
    });

    afterAll(function() {
        mockery.deregisterAll();
    });
    
    it('should initialize passport', function() {
        expect(passport.initialize).toHaveBeenCalled();
    });
    
    it('should setup passport sessions', function() {
        expect(passport.session).toHaveBeenCalled();
    });
    
    it('should configure the passport strategy', function(done) {
        
        request(app).get('/')
            .expect(302)
            .expect(function(res) {
                
                var location = url.parse(res.header.location);
                var params = {};
                location.query.split('&').forEach(function(item) {
                    var key = item.split('=')[0];
                    var value = item.split('=')[1];
                    params[key] = value;
                });
                
                var callBackUrl = url.parse(decodeURIComponent(params["redirect_uri"]));
                expect(decodeURIComponent(params["scope"])).toEqual('user:email,repo');
                expect(params["client_id"]).toEqual(clientID);
                //expect(callBackUrl.path).toEqual('/oauth/github');
            })
            .end(finish_test(done));       
    });
    
    it('should store the access token and profile', function() {
        
        var accessToken = 'access';
        var refreshToken = 'refresh';
        var profile = 'profile';
        passport._strategies["github"]._verify(accessToken, refreshToken, profile, mock.done);      
        expect(mock.done).toHaveBeenCalled();
        expect(mock.done.calls.argsFor(0)[1]).toEqual({profile: profile, accessToken: accessToken});
    })
    
    it('should serialize the user', function() {
        
        mockEncryptionHelper.encrypt = function(plainText, cb) {
            cb(plainText);
        };
        spyOn(mockEncryptionHelper, 'encrypt').and.callThrough();
        var user = {user: 'user'};
        passport._serializers[0](user, mock.done);
        expect(mock.done.calls.argsFor(0)).toEqual([null, JSON.stringify(user)]);       
    });
    
    it('should deserialize the user', function() {
        
        var user = {user: 'user'};
        mockEncryptionHelper.decrypt = function(cipherText) {
            return cipherText;
        };
        spyOn(mockEncryptionHelper, 'decrypt').and.callThrough();
        passport._deserializers[0](JSON.stringify(user), mock.done);
        expect(mock.done.calls.argsFor(0)).toEqual([null, user]);
        
    });
});
