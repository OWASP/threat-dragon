'use strict';

var request = require('supertest');
var finish_test = require('./helpers/supertest-jasmine');

describe('loggers config tests', function() {
    
    var app;
    
    beforeEach(function() {
        app = require('express')();
        require('../../td/config/loggers.config')(app);
    });
    
    it('should set the logger on requests', function(done) {

        app.get('/test', function(req, res){
            expect(req.log).toBeDefined();
            res.status(200).send('result');
        });
        
        request(app)
        .get('/test')
        .expect(200)
        .end(finish_test(done));
    });
});