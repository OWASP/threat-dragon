'use strict';

var path = require('path');

var mockery = require('mockery');
var request = require('supertest');
var finish_test = require('./helpers/supertest-jasmine');

describe('app tests', function() {
    
    beforeEach(function() {
        mockery.enable({ useCleanCache: true });
        mockery.warnOnUnregistered(false);
        mockery.warnOnReplace(false);
    });
    
    afterEach(function() {
        mockery.disable();
    });
    
    it('should not throw', function() {
        expect(function() { require('../../td/app')}).not.toThrow();  
    });
    
    it('should fetch the favicon',function(done) {
        
        console.log(__dirname);
        var app = require('../../td/app');
        request(app)
        .get('/favicon.ico')
        .expect(200)
        .end(finish_test(done));
        
    });
});