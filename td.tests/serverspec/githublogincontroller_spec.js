'use strict';

require('jasmine');
var mockery = require('mockery');
var moduleUnderTest = '../../td/controllers/githublogincontroller';
mockery.registerAllowable(moduleUnderTest);

var githubLoginController = require(moduleUnderTest);

//request/response mocks
var mockRequest;
var mockResponse;
var mockSession;
var next;

describe('githublogincontroller tests', function() {

    beforeEach(function() {
        
        mockery.enable({useCleanCache: true});

        mockRequest = {};
        mockRequest.session = {};
        mockRequest.query = {};
        mockRequest.logOut = function() {};
        mockRequest.user = {profile: {username: 'test username'}};
        mockRequest.log = {
            info: function() {},
            error: function() {}
        };
        
        mockSession = {};
        mockSession.destroy = function(cb) { cb();};
        mockRequest.session = mockSession;
        
        mockResponse = {};
        mockResponse.redirect = function() {};
        mockResponse.clearCookie = function () {};
        mockResponse.cookie = function() {};
        
        next = jasmine.createSpy('next');
        
    });
    
    afterEach(function() {
    
        mockery.disable();
    
    });
    
    it('should call the next middleware', function() {
    
        githubLoginController.startLogin(mockRequest, mockResponse, next);
        expect(next).toHaveBeenCalled();
    
    });
    
    it('should store the supplied hash fragment in the session', function() {
        
        var location = '/testlocation';
        mockRequest.query.loc = location;
        githubLoginController.startLogin(mockRequest, mockResponse, next);
        expect(mockRequest.session.returnTo).toEqual('/#' + location);

    });
    
    it('should store a default hash fragment in the session', function() {
        
        githubLoginController.startLogin(mockRequest, mockResponse, next);
        expect(mockRequest.session.returnTo).toEqual('/#/');  
        
    });
    
    it('should return the user profile', function() {
        
        var profile = 'test profile';
        mockRequest.user = {profile: profile};
        mockResponse.json = function() {};
        spyOn(mockResponse, 'json');
        githubLoginController.profile(mockRequest, mockResponse, next);
        expect(next).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalled();
        expect(mockResponse.json.calls.argsFor(0)[0]).toEqual(profile);
        
    });
    
    it('should clear the idp and connect.sid cookies', function() {
       
        spyOn(mockResponse, 'clearCookie');
        githubLoginController.logout(mockRequest, mockResponse,next);    
        expect(mockResponse.clearCookie.calls.argsFor(0)).toEqual(['idp']);
        expect(mockResponse.clearCookie.calls.argsFor(1)).toEqual(['connect.sid']);   
    });
    
    it('should log the logout', function() {

        var testUserName = 'test username'
        mockRequest.user.profile.username = testUserName;
        spyOn(mockRequest.log, 'info');
        githubLoginController.logout(mockRequest, mockResponse, next);
        expect(mockRequest.log.info.calls.argsFor(0)[0].indexOf(testUserName) >= 0).toBe(true);
    });
    
    it('should destroy the session and redirect to app root', function() {
        
        spyOn(mockSession, 'destroy').and.callThrough();
        spyOn(mockResponse, 'redirect');
        githubLoginController.logout(mockRequest, mockResponse, next); 
        expect(mockSession.destroy).toHaveBeenCalled();
        expect(mockResponse.redirect).toHaveBeenCalled();
        expect(mockResponse.redirect.calls.argsFor(0)).toEqual(['/']);
        expect(next).not.toHaveBeenCalled();       
        
    });
    
    it('should set the idp cookie', function() {
        
        spyOn(mockResponse, 'cookie');
        githubLoginController.setIDP(mockRequest, mockResponse, next);
        expect(mockResponse.cookie.calls.argsFor(0)).toEqual(['idp', 'github', {httpOnly: false}]);
        
    });
    
    it('should log the login', function() {

        var testUserName = 'test username'
        mockRequest.user.profile.username = testUserName;
        spyOn(mockRequest.log, 'info');
        githubLoginController.setIDP(mockRequest, mockResponse, next);
        expect(mockRequest.log.info.calls.argsFor(0)[0].indexOf(testUserName) >= 0).toBe(true);
    });
    
    it('should redirect to app root', function() {
        
        spyOn(mockResponse, 'redirect')
        githubLoginController.setIDP(mockRequest, mockResponse, next);
        expect(mockResponse.redirect.calls.argsFor(0)).toEqual(['/']);
        expect(next).not.toHaveBeenCalled();  
             
    });
    
    it('should redirect to the session returnTo', function() {

        var returnTo = 'test return to';
        mockRequest.session.returnTo = returnTo;
        spyOn(mockResponse, 'redirect')
        githubLoginController.setIDP(mockRequest, mockResponse, next);
        expect(mockResponse.redirect.calls.argsFor(0)).toEqual([returnTo]);
        expect(next).not.toHaveBeenCalled();  
             
    });
    
});